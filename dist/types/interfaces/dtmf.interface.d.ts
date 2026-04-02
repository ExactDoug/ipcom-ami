export interface I_DTMFBegin {
    Event: string;
    Channel: string;
    ChannelState: string;
    ChannelStateDesc: string;
    CallerIDNum: number;
    CallerIDName: string;
    ConnectedLineNum: number;
    ConnectedLineName: string;
    AccountCode: number;
    Context: string;
    Exten: string;
    Priority: string;
    Uniqueid: string;
    Linkedid: string;
    Digit: string;
    Direction: "Received" | "Sent";
}
export interface I_DTMFEnd {
    Event: string;
    Channel: string;
    ChannelState: string;
    ChannelStateDesc: string;
    CallerIDNum: number;
    CallerIDName: string;
    ConnectedLineNum: number;
    ConnectedLineName: string;
    AccountCode: number;
    Context: string;
    Exten: string;
    Priority: string;
    Uniqueid: string;
    Linkedid: string;
    Digit: string;
    DurationMs: number;
    Direction: "Received" | "Sent";
}
//# sourceMappingURL=dtmf.interface.d.ts.map