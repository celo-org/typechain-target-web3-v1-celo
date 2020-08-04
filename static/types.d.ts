import { EventEmitter } from 'events'
import { BlockNumber, EventLog } from 'web3-core'

export interface EventOptions {
  filter?: object
  fromBlock?: BlockNumber
  topics?: string[]
}

export interface ContractEventLog<T> extends EventLog {
  returnValues: T
}

export interface ContractEventEmitter<T> extends EventEmitter {
  on(event: 'connected', listener: (subscriptionId: string) => void): this
  on(event: 'data' | 'changed', listener: (event: ContractEventLog<T>) => void): this
  on(event: 'error', listener: (error: Error) => void): this
}

export type ContractEvent<T> = (
  options?: EventOptions,
  cb?: Callback<ContractEventLog<T>>
) => ContractEventEmitter<T>
