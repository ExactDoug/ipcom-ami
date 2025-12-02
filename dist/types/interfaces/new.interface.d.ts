export interface I_NewChannel {
    Event: string;
    Privilege: string;
    Channel: string;
    ChannelState: number;
    ChannelStateDesc: string;
    CallerIDNum: number;
    CallerIDName: string;
    ConnectedLineNum: number;
    ConnectedLineName: string;
    Language: string;
    AccountCode: number;
    Context: string;
    Exten: string;
    Priority: string;
    Uniqueid: string;
    Linkedid: string;
}
export interface I_NewState {
    Event: string;
    Privilege: string;
    Channel: string;
    ChannelState: number;
    ChannelStateDesc: string;
    CallerIDNum: number;
    CallerIDName: string;
    ConnectedLineNum: number;
    ConnectedLineName: string;
    Language: string;
    AccountCode: number;
    Context: string;
    Exten: string;
    Priority: string;
    Uniqueid: string;
    Linkedid: string;
}
export interface I_NewConnectedLine {
    Event: string;
    Privilege: string;
    Channel: string;
    ChannelState: number;
    ChannelStateDesc: string;
    CallerIDNum: number;
    CallerIDName: string;
    ConnectedLineNum: number;
    ConnectedLineName: string;
    Language: string;
    AccountCode: number;
    Context: string;
    Exten: string;
    Priority: string;
    Uniqueid: string;
    Linkedid: string;
}
export interface I_NewExten {
    Event: string;
    Channel: string;
    ChannelState: number;
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
    Extension: string;
    Application: string;
    AppData: string;
}
//# sourceMappingURL=new.interface.d.ts.map