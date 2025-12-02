import type { AsteriskVersion } from "../types/version.js";
export interface IeAmiOptions<V extends AsteriskVersion = '18'> {
    host: string;
    port: number;
    userName: string;
    password: string;
    additionalOptions?: IAddinionalOptions<V>;
}
export interface IAddinionalOptions<V extends AsteriskVersion = '18'> {
    debug?: boolean;
    resendTimeOut?: number;
    reconnect?: boolean;
    maxReconnectCount?: number;
    emitAllEvents?: boolean;
    heartbeatInterval?: number;
    excludeEvents?: string[];
    version?: V;
}
//# sourceMappingURL=configure.interface.d.ts.map