/**
 * Asterisk AMI version identifier
 *
 * Supports:
 * - '18': Asterisk 18 / AMI 1.8
 * - '20': Asterisk 20 / AMI 2.0
 */
export type AsteriskVersion = '18' | '20';

/**
 * Version information for the connected Asterisk instance
 */
export interface VersionInfo {
	version: AsteriskVersion;
	asteriskVersion?: string;
	amiVersion?: string;
}
