import type { AsteriskVersion } from "../types/version.js";

export interface IeAmiOptions<V extends AsteriskVersion = '18'> {
	host: string
	port: number
	userName: string
	password: string

	additionalOptions?: IAddinionalOptions<V>
}
export interface IAddinionalOptions<V extends AsteriskVersion = '18'> {

	//Output messages to the console
	debug?: boolean
	//Delay before resending a command (in seconds)
	resendTimeOut?: number
	//reconnect after timeout defibrillation
	reconnect?: boolean
	maxReconnectCount?: number
	emitAllEvents?: boolean

	//ping command frequency
	heartbeatInterval?: number

	//list of excluded events
	excludeEvents?: string[]

	// Asterisk version for type-safe API support
	// Defaults to '18' for backward compatibility
	version?: V
}