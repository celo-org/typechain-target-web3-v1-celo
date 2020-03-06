import { join, resolve } from 'path'
import { TContext, TFileDesc, TsGeneratorPlugin } from 'ts-generator'
import { extractAbi, getFilename, parse } from 'typechain'
import { codegen } from './generation'

export interface IWeb3Cfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/web3-v1-celo-ontracts/'

export default class Web3V1Celo extends TsGeneratorPlugin {
  name = 'Web3-v1-celo'

  private readonly outDirAbs: string

  constructor(ctx: TContext<IWeb3Cfg>) {
    super(ctx)

    const { cwd, rawConfig } = ctx

    this.outDirAbs = resolve(cwd, rawConfig.outDir || DEFAULT_OUT_PATH)
  }

  transformFile(file: TFileDesc): TFileDesc | void {
    const abi = extractAbi(file.contents)
    const isEmptyAbi = abi.length === 0
    if (isEmptyAbi) {
      return
    }

    const name = getFilename(file.path)

    const contract = parse(abi, name)

    return {
      path: join(this.outDirAbs, `${name}.ts`),
      contents: codegen(contract, abi),
    }
  }

  afterRun(): TFileDesc[] {
    return []
    //       {
    //         path: join(this.outDirAbs, 'types.d.ts'),
    //         contents: `
    //   import { EventEmitter } from 'events'
    //   import { EventLog } from 'web3-core'
    //   import { Callback } from 'web3-core-helpers'

    //   interface EventOptions {
    //     filter?: object
    //     fromBlock?: BlockType
    //     topics?: string[]
    //   }

    //   export interface ContractEventLog<T> extends EventLog {
    //     returnValues: T
    //   }
    //   export interface ContractEventEmitter<T> extends EventEmitter {
    //     on(event: 'connected', listener: (subscriptionId: string) => void): this
    //     on(event: 'data' | 'changed', listener: (event: ContractEventLog<T>) => void): this
    //     on(event: 'error', listener: (error: Error) => void): this
    //   }
    //   export type ContractEvent<T> = (
    //     options?: EventOptions,
    //     cb?: Callback<ContractEventLog<T>>,
    //   ) => ContractEventEmitter<T>
    // `,
    //       },
    //     ]
  }
}
