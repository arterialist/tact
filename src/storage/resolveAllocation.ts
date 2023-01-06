import { CompilerContext, createContextStore } from "../context";
import { getAllTypes, getType } from "../types/resolveDescriptors";
import { TypeDescription } from "../types/types";
import { topologicalSort } from "../utils/utils";
import { crc32 } from "../utils/crc32";
import { StorageAllocation } from "./StorageAllocation";
import { AllocationOperation } from "./operation";
import { allocate, getAllocationOperationFromField } from "./allocator";
import { createTLBType } from "../types/createTLBType";

let store = createContextStore<StorageAllocation>();

export function getAllocation(ctx: CompilerContext, name: string) {
    let t = store.get(ctx, name);
    if (!t) {
        throw Error('Allocation for ' + name + ' not found');
    }
    return t;
}

export function getAllocations(ctx: CompilerContext) {
    return getSortedTypes(ctx).map((v) => ({ allocation: getAllocation(ctx, v.name), type: v }));
}

function getSortedTypes(ctx: CompilerContext) {
    let types = Object.values(getAllTypes(ctx)).filter((v) => v.kind === 'struct' || v.kind === 'contract');
    let structs = types.filter(t => t.kind === 'struct');
    let refs = (src: TypeDescription) => {
        let res: TypeDescription[] = []
        let t = new Set<string>();
        for (let f of src.fields) {
            let r = f.type;
            if (r.kind === 'ref') {
                let tp = getType(ctx, r.name);
                if (tp.kind === 'struct') {
                    if (!t.has(tp.name)) {
                        t.add(r.name);
                        res.push(tp);
                    }
                }
            }
        }
        return res;
    }
    structs = topologicalSort(structs, refs);
    structs = [...structs, ...types.filter((v) => v.kind === 'contract')];
    return structs;
}

export function resolveAllocations(ctx: CompilerContext) {

    // Load topological order of structs and contracts
    let types = getSortedTypes(ctx);

    // Generate allocations
    for (let s of types) {

        // Resolve prefix
        let header: number | null = null;
        if (s.ast.kind === 'def_struct' && s.ast.message) {
            if (s.ast.prefix !== null) {
                header = s.ast.prefix;
            } else {
                header = crc32(Buffer.from(s.name)); // TODO: Better allocation
            }
        }

        // Reserve bits
        let reserveBits = 0;
        if (header !== null) {
            reserveBits += 32; // Header size
        }

        // Reserver refs
        let reserveRefs = 0;
        if (s.kind === 'contract') {
            reserveRefs += 1; // Internal state
        }

        // Convert fields
        let ops: AllocationOperation[] = [];
        for (let f of s.fields) {
            ops.push(getAllocationOperationFromField(f.abi.type, (name) => store.get(ctx, name)!.size));
        }

        // Perform allocation
        let root = allocate({ ops, reserved: { bits: reserveBits, refs: reserveRefs } });

        // tlb
        let tlb = createTLBType(s.name, s.fields.map((d) => d.abi), header !== null ? 'message' : 'struct');

        // Store allocation
        let allocation: StorageAllocation = {
            type: s,
            header, root,
            tlb: tlb.tlb,
            size: {
                bits: root.size.bits + reserveBits,
                refs: root.size.refs + reserveRefs
            }
        };
        ctx = store.set(ctx, s.name, allocation);
    }

    return ctx;
}