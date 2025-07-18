
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model DataQueue
 * 
 */
export type DataQueue = $Result.DefaultSelection<Prisma.$DataQueuePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more DataQueues
 * const dataQueues = await prisma.dataQueue.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more DataQueues
   * const dataQueues = await prisma.dataQueue.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.dataQueue`: Exposes CRUD operations for the **DataQueue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DataQueues
    * const dataQueues = await prisma.dataQueue.findMany()
    * ```
    */
  get dataQueue(): Prisma.DataQueueDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    DataQueue: 'DataQueue'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "dataQueue"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      DataQueue: {
        payload: Prisma.$DataQueuePayload<ExtArgs>
        fields: Prisma.DataQueueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DataQueueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DataQueueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload>
          }
          findFirst: {
            args: Prisma.DataQueueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DataQueueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload>
          }
          findMany: {
            args: Prisma.DataQueueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload>[]
          }
          create: {
            args: Prisma.DataQueueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload>
          }
          createMany: {
            args: Prisma.DataQueueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DataQueueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload>
          }
          update: {
            args: Prisma.DataQueueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload>
          }
          deleteMany: {
            args: Prisma.DataQueueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DataQueueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DataQueueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataQueuePayload>
          }
          aggregate: {
            args: Prisma.DataQueueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataQueue>
          }
          groupBy: {
            args: Prisma.DataQueueGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataQueueGroupByOutputType>[]
          }
          count: {
            args: Prisma.DataQueueCountArgs<ExtArgs>
            result: $Utils.Optional<DataQueueCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    dataQueue?: DataQueueOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model DataQueue
   */

  export type AggregateDataQueue = {
    _count: DataQueueCountAggregateOutputType | null
    _avg: DataQueueAvgAggregateOutputType | null
    _sum: DataQueueSumAggregateOutputType | null
    _min: DataQueueMinAggregateOutputType | null
    _max: DataQueueMaxAggregateOutputType | null
  }

  export type DataQueueAvgAggregateOutputType = {
    id: number | null
    lastQueue: number | null
    previousQueue: number | null
  }

  export type DataQueueSumAggregateOutputType = {
    id: number | null
    lastQueue: number | null
    previousQueue: number | null
  }

  export type DataQueueMinAggregateOutputType = {
    id: number | null
    date: Date | null
    lastQueue: number | null
    previousQueue: number | null
    source: string | null
    location: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DataQueueMaxAggregateOutputType = {
    id: number | null
    date: Date | null
    lastQueue: number | null
    previousQueue: number | null
    source: string | null
    location: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DataQueueCountAggregateOutputType = {
    id: number
    date: number
    lastQueue: number
    previousQueue: number
    source: number
    location: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DataQueueAvgAggregateInputType = {
    id?: true
    lastQueue?: true
    previousQueue?: true
  }

  export type DataQueueSumAggregateInputType = {
    id?: true
    lastQueue?: true
    previousQueue?: true
  }

  export type DataQueueMinAggregateInputType = {
    id?: true
    date?: true
    lastQueue?: true
    previousQueue?: true
    source?: true
    location?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DataQueueMaxAggregateInputType = {
    id?: true
    date?: true
    lastQueue?: true
    previousQueue?: true
    source?: true
    location?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DataQueueCountAggregateInputType = {
    id?: true
    date?: true
    lastQueue?: true
    previousQueue?: true
    source?: true
    location?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DataQueueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataQueue to aggregate.
     */
    where?: DataQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataQueues to fetch.
     */
    orderBy?: DataQueueOrderByWithRelationInput | DataQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DataQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DataQueues
    **/
    _count?: true | DataQueueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DataQueueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DataQueueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataQueueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataQueueMaxAggregateInputType
  }

  export type GetDataQueueAggregateType<T extends DataQueueAggregateArgs> = {
        [P in keyof T & keyof AggregateDataQueue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataQueue[P]>
      : GetScalarType<T[P], AggregateDataQueue[P]>
  }




  export type DataQueueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataQueueWhereInput
    orderBy?: DataQueueOrderByWithAggregationInput | DataQueueOrderByWithAggregationInput[]
    by: DataQueueScalarFieldEnum[] | DataQueueScalarFieldEnum
    having?: DataQueueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataQueueCountAggregateInputType | true
    _avg?: DataQueueAvgAggregateInputType
    _sum?: DataQueueSumAggregateInputType
    _min?: DataQueueMinAggregateInputType
    _max?: DataQueueMaxAggregateInputType
  }

  export type DataQueueGroupByOutputType = {
    id: number
    date: Date
    lastQueue: number
    previousQueue: number
    source: string
    location: string | null
    createdAt: Date
    updatedAt: Date
    _count: DataQueueCountAggregateOutputType | null
    _avg: DataQueueAvgAggregateOutputType | null
    _sum: DataQueueSumAggregateOutputType | null
    _min: DataQueueMinAggregateOutputType | null
    _max: DataQueueMaxAggregateOutputType | null
  }

  type GetDataQueueGroupByPayload<T extends DataQueueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataQueueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataQueueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataQueueGroupByOutputType[P]>
            : GetScalarType<T[P], DataQueueGroupByOutputType[P]>
        }
      >
    >


  export type DataQueueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    lastQueue?: boolean
    previousQueue?: boolean
    source?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dataQueue"]>



  export type DataQueueSelectScalar = {
    id?: boolean
    date?: boolean
    lastQueue?: boolean
    previousQueue?: boolean
    source?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DataQueueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "lastQueue" | "previousQueue" | "source" | "location" | "createdAt" | "updatedAt", ExtArgs["result"]["dataQueue"]>

  export type $DataQueuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DataQueue"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      date: Date
      lastQueue: number
      previousQueue: number
      source: string
      location: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dataQueue"]>
    composites: {}
  }

  type DataQueueGetPayload<S extends boolean | null | undefined | DataQueueDefaultArgs> = $Result.GetResult<Prisma.$DataQueuePayload, S>

  type DataQueueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DataQueueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DataQueueCountAggregateInputType | true
    }

  export interface DataQueueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DataQueue'], meta: { name: 'DataQueue' } }
    /**
     * Find zero or one DataQueue that matches the filter.
     * @param {DataQueueFindUniqueArgs} args - Arguments to find a DataQueue
     * @example
     * // Get one DataQueue
     * const dataQueue = await prisma.dataQueue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DataQueueFindUniqueArgs>(args: SelectSubset<T, DataQueueFindUniqueArgs<ExtArgs>>): Prisma__DataQueueClient<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DataQueue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DataQueueFindUniqueOrThrowArgs} args - Arguments to find a DataQueue
     * @example
     * // Get one DataQueue
     * const dataQueue = await prisma.dataQueue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DataQueueFindUniqueOrThrowArgs>(args: SelectSubset<T, DataQueueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DataQueueClient<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DataQueue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataQueueFindFirstArgs} args - Arguments to find a DataQueue
     * @example
     * // Get one DataQueue
     * const dataQueue = await prisma.dataQueue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DataQueueFindFirstArgs>(args?: SelectSubset<T, DataQueueFindFirstArgs<ExtArgs>>): Prisma__DataQueueClient<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DataQueue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataQueueFindFirstOrThrowArgs} args - Arguments to find a DataQueue
     * @example
     * // Get one DataQueue
     * const dataQueue = await prisma.dataQueue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DataQueueFindFirstOrThrowArgs>(args?: SelectSubset<T, DataQueueFindFirstOrThrowArgs<ExtArgs>>): Prisma__DataQueueClient<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DataQueues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataQueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DataQueues
     * const dataQueues = await prisma.dataQueue.findMany()
     * 
     * // Get first 10 DataQueues
     * const dataQueues = await prisma.dataQueue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dataQueueWithIdOnly = await prisma.dataQueue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DataQueueFindManyArgs>(args?: SelectSubset<T, DataQueueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DataQueue.
     * @param {DataQueueCreateArgs} args - Arguments to create a DataQueue.
     * @example
     * // Create one DataQueue
     * const DataQueue = await prisma.dataQueue.create({
     *   data: {
     *     // ... data to create a DataQueue
     *   }
     * })
     * 
     */
    create<T extends DataQueueCreateArgs>(args: SelectSubset<T, DataQueueCreateArgs<ExtArgs>>): Prisma__DataQueueClient<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DataQueues.
     * @param {DataQueueCreateManyArgs} args - Arguments to create many DataQueues.
     * @example
     * // Create many DataQueues
     * const dataQueue = await prisma.dataQueue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DataQueueCreateManyArgs>(args?: SelectSubset<T, DataQueueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DataQueue.
     * @param {DataQueueDeleteArgs} args - Arguments to delete one DataQueue.
     * @example
     * // Delete one DataQueue
     * const DataQueue = await prisma.dataQueue.delete({
     *   where: {
     *     // ... filter to delete one DataQueue
     *   }
     * })
     * 
     */
    delete<T extends DataQueueDeleteArgs>(args: SelectSubset<T, DataQueueDeleteArgs<ExtArgs>>): Prisma__DataQueueClient<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DataQueue.
     * @param {DataQueueUpdateArgs} args - Arguments to update one DataQueue.
     * @example
     * // Update one DataQueue
     * const dataQueue = await prisma.dataQueue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DataQueueUpdateArgs>(args: SelectSubset<T, DataQueueUpdateArgs<ExtArgs>>): Prisma__DataQueueClient<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DataQueues.
     * @param {DataQueueDeleteManyArgs} args - Arguments to filter DataQueues to delete.
     * @example
     * // Delete a few DataQueues
     * const { count } = await prisma.dataQueue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DataQueueDeleteManyArgs>(args?: SelectSubset<T, DataQueueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataQueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DataQueues
     * const dataQueue = await prisma.dataQueue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DataQueueUpdateManyArgs>(args: SelectSubset<T, DataQueueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DataQueue.
     * @param {DataQueueUpsertArgs} args - Arguments to update or create a DataQueue.
     * @example
     * // Update or create a DataQueue
     * const dataQueue = await prisma.dataQueue.upsert({
     *   create: {
     *     // ... data to create a DataQueue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DataQueue we want to update
     *   }
     * })
     */
    upsert<T extends DataQueueUpsertArgs>(args: SelectSubset<T, DataQueueUpsertArgs<ExtArgs>>): Prisma__DataQueueClient<$Result.GetResult<Prisma.$DataQueuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DataQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataQueueCountArgs} args - Arguments to filter DataQueues to count.
     * @example
     * // Count the number of DataQueues
     * const count = await prisma.dataQueue.count({
     *   where: {
     *     // ... the filter for the DataQueues we want to count
     *   }
     * })
    **/
    count<T extends DataQueueCountArgs>(
      args?: Subset<T, DataQueueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataQueueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DataQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataQueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DataQueueAggregateArgs>(args: Subset<T, DataQueueAggregateArgs>): Prisma.PrismaPromise<GetDataQueueAggregateType<T>>

    /**
     * Group by DataQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataQueueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DataQueueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DataQueueGroupByArgs['orderBy'] }
        : { orderBy?: DataQueueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DataQueueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataQueueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DataQueue model
   */
  readonly fields: DataQueueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DataQueue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DataQueueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DataQueue model
   */
  interface DataQueueFieldRefs {
    readonly id: FieldRef<"DataQueue", 'Int'>
    readonly date: FieldRef<"DataQueue", 'DateTime'>
    readonly lastQueue: FieldRef<"DataQueue", 'Int'>
    readonly previousQueue: FieldRef<"DataQueue", 'Int'>
    readonly source: FieldRef<"DataQueue", 'String'>
    readonly location: FieldRef<"DataQueue", 'String'>
    readonly createdAt: FieldRef<"DataQueue", 'DateTime'>
    readonly updatedAt: FieldRef<"DataQueue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DataQueue findUnique
   */
  export type DataQueueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * Filter, which DataQueue to fetch.
     */
    where: DataQueueWhereUniqueInput
  }

  /**
   * DataQueue findUniqueOrThrow
   */
  export type DataQueueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * Filter, which DataQueue to fetch.
     */
    where: DataQueueWhereUniqueInput
  }

  /**
   * DataQueue findFirst
   */
  export type DataQueueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * Filter, which DataQueue to fetch.
     */
    where?: DataQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataQueues to fetch.
     */
    orderBy?: DataQueueOrderByWithRelationInput | DataQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataQueues.
     */
    cursor?: DataQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataQueues.
     */
    distinct?: DataQueueScalarFieldEnum | DataQueueScalarFieldEnum[]
  }

  /**
   * DataQueue findFirstOrThrow
   */
  export type DataQueueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * Filter, which DataQueue to fetch.
     */
    where?: DataQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataQueues to fetch.
     */
    orderBy?: DataQueueOrderByWithRelationInput | DataQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataQueues.
     */
    cursor?: DataQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataQueues.
     */
    distinct?: DataQueueScalarFieldEnum | DataQueueScalarFieldEnum[]
  }

  /**
   * DataQueue findMany
   */
  export type DataQueueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * Filter, which DataQueues to fetch.
     */
    where?: DataQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataQueues to fetch.
     */
    orderBy?: DataQueueOrderByWithRelationInput | DataQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DataQueues.
     */
    cursor?: DataQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataQueues.
     */
    skip?: number
    distinct?: DataQueueScalarFieldEnum | DataQueueScalarFieldEnum[]
  }

  /**
   * DataQueue create
   */
  export type DataQueueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * The data needed to create a DataQueue.
     */
    data: XOR<DataQueueCreateInput, DataQueueUncheckedCreateInput>
  }

  /**
   * DataQueue createMany
   */
  export type DataQueueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DataQueues.
     */
    data: DataQueueCreateManyInput | DataQueueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DataQueue update
   */
  export type DataQueueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * The data needed to update a DataQueue.
     */
    data: XOR<DataQueueUpdateInput, DataQueueUncheckedUpdateInput>
    /**
     * Choose, which DataQueue to update.
     */
    where: DataQueueWhereUniqueInput
  }

  /**
   * DataQueue updateMany
   */
  export type DataQueueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DataQueues.
     */
    data: XOR<DataQueueUpdateManyMutationInput, DataQueueUncheckedUpdateManyInput>
    /**
     * Filter which DataQueues to update
     */
    where?: DataQueueWhereInput
    /**
     * Limit how many DataQueues to update.
     */
    limit?: number
  }

  /**
   * DataQueue upsert
   */
  export type DataQueueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * The filter to search for the DataQueue to update in case it exists.
     */
    where: DataQueueWhereUniqueInput
    /**
     * In case the DataQueue found by the `where` argument doesn't exist, create a new DataQueue with this data.
     */
    create: XOR<DataQueueCreateInput, DataQueueUncheckedCreateInput>
    /**
     * In case the DataQueue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DataQueueUpdateInput, DataQueueUncheckedUpdateInput>
  }

  /**
   * DataQueue delete
   */
  export type DataQueueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
    /**
     * Filter which DataQueue to delete.
     */
    where: DataQueueWhereUniqueInput
  }

  /**
   * DataQueue deleteMany
   */
  export type DataQueueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataQueues to delete
     */
    where?: DataQueueWhereInput
    /**
     * Limit how many DataQueues to delete.
     */
    limit?: number
  }

  /**
   * DataQueue without action
   */
  export type DataQueueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataQueue
     */
    select?: DataQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataQueue
     */
    omit?: DataQueueOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DataQueueScalarFieldEnum: {
    id: 'id',
    date: 'date',
    lastQueue: 'lastQueue',
    previousQueue: 'previousQueue',
    source: 'source',
    location: 'location',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DataQueueScalarFieldEnum = (typeof DataQueueScalarFieldEnum)[keyof typeof DataQueueScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const DataQueueOrderByRelevanceFieldEnum: {
    source: 'source',
    location: 'location'
  };

  export type DataQueueOrderByRelevanceFieldEnum = (typeof DataQueueOrderByRelevanceFieldEnum)[keyof typeof DataQueueOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type DataQueueWhereInput = {
    AND?: DataQueueWhereInput | DataQueueWhereInput[]
    OR?: DataQueueWhereInput[]
    NOT?: DataQueueWhereInput | DataQueueWhereInput[]
    id?: IntFilter<"DataQueue"> | number
    date?: DateTimeFilter<"DataQueue"> | Date | string
    lastQueue?: IntFilter<"DataQueue"> | number
    previousQueue?: IntFilter<"DataQueue"> | number
    source?: StringFilter<"DataQueue"> | string
    location?: StringNullableFilter<"DataQueue"> | string | null
    createdAt?: DateTimeFilter<"DataQueue"> | Date | string
    updatedAt?: DateTimeFilter<"DataQueue"> | Date | string
  }

  export type DataQueueOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    lastQueue?: SortOrder
    previousQueue?: SortOrder
    source?: SortOrder
    location?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: DataQueueOrderByRelevanceInput
  }

  export type DataQueueWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    date?: Date | string
    AND?: DataQueueWhereInput | DataQueueWhereInput[]
    OR?: DataQueueWhereInput[]
    NOT?: DataQueueWhereInput | DataQueueWhereInput[]
    lastQueue?: IntFilter<"DataQueue"> | number
    previousQueue?: IntFilter<"DataQueue"> | number
    source?: StringFilter<"DataQueue"> | string
    location?: StringNullableFilter<"DataQueue"> | string | null
    createdAt?: DateTimeFilter<"DataQueue"> | Date | string
    updatedAt?: DateTimeFilter<"DataQueue"> | Date | string
  }, "id" | "date">

  export type DataQueueOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    lastQueue?: SortOrder
    previousQueue?: SortOrder
    source?: SortOrder
    location?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DataQueueCountOrderByAggregateInput
    _avg?: DataQueueAvgOrderByAggregateInput
    _max?: DataQueueMaxOrderByAggregateInput
    _min?: DataQueueMinOrderByAggregateInput
    _sum?: DataQueueSumOrderByAggregateInput
  }

  export type DataQueueScalarWhereWithAggregatesInput = {
    AND?: DataQueueScalarWhereWithAggregatesInput | DataQueueScalarWhereWithAggregatesInput[]
    OR?: DataQueueScalarWhereWithAggregatesInput[]
    NOT?: DataQueueScalarWhereWithAggregatesInput | DataQueueScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DataQueue"> | number
    date?: DateTimeWithAggregatesFilter<"DataQueue"> | Date | string
    lastQueue?: IntWithAggregatesFilter<"DataQueue"> | number
    previousQueue?: IntWithAggregatesFilter<"DataQueue"> | number
    source?: StringWithAggregatesFilter<"DataQueue"> | string
    location?: StringNullableWithAggregatesFilter<"DataQueue"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DataQueue"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DataQueue"> | Date | string
  }

  export type DataQueueCreateInput = {
    date: Date | string
    lastQueue: number
    previousQueue: number
    source?: string
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataQueueUncheckedCreateInput = {
    id?: number
    date: Date | string
    lastQueue: number
    previousQueue: number
    source?: string
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataQueueUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    lastQueue?: IntFieldUpdateOperationsInput | number
    previousQueue?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataQueueUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    lastQueue?: IntFieldUpdateOperationsInput | number
    previousQueue?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataQueueCreateManyInput = {
    id?: number
    date: Date | string
    lastQueue: number
    previousQueue: number
    source?: string
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataQueueUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    lastQueue?: IntFieldUpdateOperationsInput | number
    previousQueue?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataQueueUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    lastQueue?: IntFieldUpdateOperationsInput | number
    previousQueue?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DataQueueOrderByRelevanceInput = {
    fields: DataQueueOrderByRelevanceFieldEnum | DataQueueOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DataQueueCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    lastQueue?: SortOrder
    previousQueue?: SortOrder
    source?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataQueueAvgOrderByAggregateInput = {
    id?: SortOrder
    lastQueue?: SortOrder
    previousQueue?: SortOrder
  }

  export type DataQueueMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    lastQueue?: SortOrder
    previousQueue?: SortOrder
    source?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataQueueMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    lastQueue?: SortOrder
    previousQueue?: SortOrder
    source?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataQueueSumOrderByAggregateInput = {
    id?: SortOrder
    lastQueue?: SortOrder
    previousQueue?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}