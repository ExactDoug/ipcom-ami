export interface I_DialBegin {
	Privilege: string               //'call,all'
	Channel: string                 //'IAX2/aster-17127'
	ChannelState: number            // 6
	ChannelStateDesc: string        //'Up'
	CallerIDNum: number             // 89*****4387
	CallerIDName: string            // null,
	ConnectedLineNum: number        // 110
	ConnectedLineName: string       //'110 test'
	Language: string                //'en'
	AccountCode: number             // null
	Context: string                 // 'callcenter'
	Exten: string                   // 1877
	Priority: string                // 3
	Uniqueid: string                // 1528262325.580184
	Linkedid: string                // 1528262325.580183

	DestChannel: string             //'IAX2/aster-25872'
	DestChannelState: number        // 5
	DestChannelStateDesc: string    //'Ringing'
	DestCallerIDNum:  number        // 1877
	DestCallerIDName: string        //'110 test'
	DestConnectedLineNum: number    // 89*****4387
	DestConnectedLineName: string   // null
	DestLanguage: string            //'en'
	DestAccountCode: number         // null
	DestContext: string             //'callcenter'
	DestExten: string               // 1877
	DestPriority: string            // 1
	DestUniqueid: string            // 1528262348.580187
	DestLinkedid: string            // 1528262325.580183'
	DialStatus: string              //'RINGING'
}
export interface I_DialEnd {
	Privilege: string               //'call,all'
	Channel: string                 //'IAX2/aster-17127'
	ChannelState: number            // 6
	ChannelStateDesc: string        //'Up'
	CallerIDNum: number             // 89*****4387
	CallerIDName: string            // null,
	ConnectedLineNum: number        // 110
	ConnectedLineName: string       //'110 test'
	Language: string                //'en'
	AccountCode: number             // null
	Context: string                 // 'callcenter'
	Exten: string                   // 1877
	Priority: string                // 3
	Uniqueid: string                // 1528262325.580184
	Linkedid: string                // 1528262325.580183

	DestChannel: string             //'IAX2/aster-25872'
	DestChannelState: number        // 5
	DestChannelStateDesc: string    //'Ringing'
	DestCallerIDNum:  number        // 1877
	DestCallerIDName: string        //'110 test'
	DestConnectedLineNum: number    // 89*****4387
	DestConnectedLineName: string   // null
	DestLanguage: string            //'en'
	DestAccountCode: number         // null
	DestContext: string             //'callcenter'
	DestExten: string               // 1877
	DestPriority: string            // 1
	DestUniqueid: string            // 1528262348.580187
	DestLinkedid: string            // 1528262325.580183'
	DialStatus: string              //'RINGING'
}
export interface I_DialState {
	Privilege: string               //'call,all'
	Channel: string                 //'IAX2/aster-17127'
	ChannelState: number            // 6
	ChannelStateDesc: string        //'Up'
	CallerIDNum: number             // 89*****4387
	CallerIDName: string            // null,
	ConnectedLineNum: number        // 110
	ConnectedLineName: string       //'110 test'
	Language: string                //'en'
	AccountCode: number             // null
	Context: string                 // 'callcenter'
	Exten: string                   // 1877
	Priority: string                // 3
	Uniqueid: string                // 1528262325.580184
	Linkedid: string                // 1528262325.580183

	DestChannel: string             //'IAX2/aster-25872'
	DestChannelState: number        // 5
	DestChannelStateDesc: string    //'Ringing'
	DestCallerIDNum:  number        // 1877
	DestCallerIDName: string        //'110 test'
	DestConnectedLineNum: number    // 89*****4387
	DestConnectedLineName: string   // null
	DestLanguage: string            //'en'
	DestAccountCode: number         // null
	DestContext: string             //'callcenter'
	DestExten: string               // 1877
	DestPriority: string            // 1
	DestUniqueid: string            // 1528262348.580187
	DestLinkedid: string            // 1528262325.580183'
	DialStatus: string              //'RINGING'
}


