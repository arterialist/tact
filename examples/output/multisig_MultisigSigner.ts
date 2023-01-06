import { Cell, Slice, Address, Builder, beginCell, ComputeError, TupleItem, TupleReader, Dictionary, contractAddress, ContractProvider, Sender, Contract, ContractABI } from 'ton-core';
import { ContractSystem, ContractExecutor } from 'ton-emulator';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeBit(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeBit(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

export type Request = {
    $$type: 'Request';
    requested: Address;
    to: Address;
    value: bigint;
    timeout: bigint;
    bounce: boolean;
    mode: bigint;
    body: Cell | null;
}

export function storeRequest(src: Request) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4096439811, 32);
        b_0.storeBit(src.requested);
        b_0.storeBit(src.to);
        b_0.storeCoins(src.value);
        b_0.storeUint(src.timeout, 32);
        b_0.storeBit(src.bounce);
        b_0.storeUint(src.mode, 8);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
    };
}

export function loadRequest(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4096439811) { throw Error('Invalid prefix'); }
    let _requested = sc_0.loadAddress();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadCoins();
    let _timeout = sc_0.loadUintBig(32);
    let _bounce = sc_0.loadBit();
    let _mode = sc_0.loadUintBig(8);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'Request' as const, requested: _requested, to: _to, value: _value, timeout: _timeout, bounce: _bounce, mode: _mode, body: _body };
}

export type Signed = {
    $$type: 'Signed';
    request: Request;
}

export function storeSigned(src: Signed) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(420994549, 32);
        storeRequest(src.request, b_0);
    };
}

export function loadSigned(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 420994549) { throw Error('Invalid prefix'); }
    _request = loadRequest(sc_0);
    return { $$type: 'Signed' as const, request: _request };
}

async function MultisigSigner_init(master: Address, members: Cell, requiredWeight: bigint, request: Request) {
    const __init = 'te6ccgEBCAEAiQABFP8A9KQT9LzyyAsBAgFiAgMCAs0EBQANoUrd4AvgDQAB1AIBIAYHAAVW8ngAs0cHAMyMwMBwVQk1AIBkQUUMvPFhn0ABeBAQHPABWBAQHPABPKAMhGFxA1GIIQ9Cq2A1AIyx9QBs8WUATPFlj6AssfygDLByFus5V/AcoAzJRwMsoA4skBzMmA==';
    const __code = 'te6ccgECHgEAA+oAART/APSkE/S88sgLAQIBYgIDAgLLBAUCAnUcHQIBIAYHAgFIEhMCASAICQABvQIBSAoLAgFYEBECfzt+3Ah10nCH5UwINcLH94C0NMDAXGwwAGRf5Fw4gH6QCJQZm8E+GECkVvgIMAAItdJwSGw4wLAAJEw4w3ywIKAMDQALCBu8tCAgAaxb7UTQ1AH4YvpAAQH0BIEBAdcAgQEB1wDSANQB0NMfAYIQ9Cq2A7ry4IH6QAEB+kABAfoA0x/SANMH0gABkdSSbQHiVWA3EHwQexB6EHkQeFUFbBzwFA4B+vkBgvAirubQptwUZXcnfdWNBq4wkKPN09iohWEYQgiuX26wObqO1e1E0NQB+GL6QAEB9ASBAQHXAIEBAdcA0gDUAdDTHwGCEPQqtgO68uCB+kABAfpAAQH6ANMf0gDTB9IAAZHUkm0B4lVgNxB8EHsQehB5EHhVBWwc8BXgDwCmyPhCAcxVsFDLzxYZ9AAXgQEBzwAVgQEBzwATygDIRhcQNRiCEPQqtgNQCMsfUAbPFlAEzxZY+gLLH8oAywchbrOVfwHKAMyUcDLKAOLJAczJ7VQAqsj4QgHMVbBQy88WGfQAF4EBAc8AFYEBAc8AE8oAyEYXEDUYghD0KrYDUAjLH1AGzxZQBM8WWPoCyx/KAMsHIW6zlX8BygDMlHAyygDiyQHMye1U2zEAIwhbpVbWfRZMODIAc8AQTP0QYAAdEEz9ApvoZQB1wAw4FttgAgEgFBUCAUgZGgAVWUfwHKAOBwAcoAgCASAWFwH3MhxAcoBUAfwEXABygJQBc8WUAP6AnABymgjbrMlbrOxjj1/8BHIcPARcPARJG6zmX/wEQTwAVAEzJU0A3DwEeIkbrOZf/ARBPABUATMlTQDcPAR4nDwEQJ/8BECyVjMljMzAXDwEeIhbrOYf/ARAfABAcyUMXDwEeLJAYBgABRsV4AAE+wAAASABdSBEpMk+CO88vSCAJ9qKLPy9PhBbyQQI18DK4EBCyKBAQHwB/ABHIEBC1ANbYEBAfAGUKugUwi+4wAJgGwCgN39wcIEAglR5h1R5h1YSyFVgghAZF931UAjLHweCEPQqtgNQCMsfUAbPFlAEzxZY+gLLH8oAywchbrOVfwHKAMyUcDLKAOLJL1UgbW3wEgcAs7C/u1E0NQB+GL6QAEB9ASBAQHXAIEBAdcA0gDUAdDTHwGCEPQqtgO68uCB+kABAfpAAQH6ANMf0gDTB9IAAZHUkm0B4lVgNxB8EHsQehB5EHhVBWwc8BPwDoABNsvRgnBc7D1dLK57HoTsOdZKhRtmgnCd1jUtK2R8syLTry398WI5g';
    const __system = 'te6cckEBAQEAAwAAAUD20kA0';
    let systemCell = Cell.fromBase64(__system);
    let __tuple: TupleItem[] = [];
    __tuple.push({ type: 'cell', cell: systemCell });
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let initCell = Cell.fromBoc(Buffer.from(__init, 'base64'))[0];
    let system = await ContractSystem.create();
    let executor = await ContractExecutor.create({ code: initCell, data: new Cell() }, system);
    let res = await executor.get('init', __tuple);
    if (!res.success) { throw Error(res.error); }
    if (res.exitCode !== 0 && res.exitCode !== 1) {
        if (MultisigSigner_errors[res.exitCode]) {
            throw new ComputeError(MultisigSigner_errors[res.exitCode].message, res.exitCode, { logs: res.vmLogs });
        } else {
            throw new ComputeError('Exit code: ' + res.exitCode, res.exitCode, { logs: res.vmLogs });
        }
    }
    
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

const MultisigSigner_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    4429: { message: `Invalid sender` },
    4755: { message: `Timeout` },
    40810: { message: `Completed` },
    46307: { message: `Not a member` },
}

export class MultisigSigner implements Contract {
    
    static async init(master: Address, members: Cell, requiredWeight: bigint, request: Request) {
        return await MultisigSigner_init(master,members,requiredWeight,request);
    }
    
    static async fromInit(master: Address, members: Cell, requiredWeight: bigint, request: Request) {
        const init = await MultisigSigner_init(master,members,requiredWeight,request);
        const address = contractAddress(0, init);
        return new MultisigSigner(address, init);
    }
    
    static fromAddress(address: Address) {
        return new MultisigSigner(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: MultisigSigner_errors
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
}