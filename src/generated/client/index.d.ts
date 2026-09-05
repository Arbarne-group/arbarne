
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model FarmerProfile
 * 
 */
export type FarmerProfile = $Result.DefaultSelection<Prisma.$FarmerProfilePayload>
/**
 * Model FarmManagement
 * 
 */
export type FarmManagement = $Result.DefaultSelection<Prisma.$FarmManagementPayload>
/**
 * Model OperatingStyle
 * 
 */
export type OperatingStyle = $Result.DefaultSelection<Prisma.$OperatingStylePayload>
/**
 * Model DigitalPlatform
 * 
 */
export type DigitalPlatform = $Result.DefaultSelection<Prisma.$DigitalPlatformPayload>
/**
 * Model Aspiration
 * 
 */
export type Aspiration = $Result.DefaultSelection<Prisma.$AspirationPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model Assessment
 * 
 */
export type Assessment = $Result.DefaultSelection<Prisma.$AssessmentPayload>
/**
 * Model PillarAssessment
 * 
 */
export type PillarAssessment = $Result.DefaultSelection<Prisma.$PillarAssessmentPayload>
/**
 * Model AssessmentResponse
 * 
 */
export type AssessmentResponse = $Result.DefaultSelection<Prisma.$AssessmentResponsePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs, $Utils.Call<Prisma.TypeMapCb, {
    extArgs: ExtArgs
  }>, ClientOptions>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.farmerProfile`: Exposes CRUD operations for the **FarmerProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FarmerProfiles
    * const farmerProfiles = await prisma.farmerProfile.findMany()
    * ```
    */
  get farmerProfile(): Prisma.FarmerProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.farmManagement`: Exposes CRUD operations for the **FarmManagement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FarmManagements
    * const farmManagements = await prisma.farmManagement.findMany()
    * ```
    */
  get farmManagement(): Prisma.FarmManagementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.operatingStyle`: Exposes CRUD operations for the **OperatingStyle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OperatingStyles
    * const operatingStyles = await prisma.operatingStyle.findMany()
    * ```
    */
  get operatingStyle(): Prisma.OperatingStyleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.digitalPlatform`: Exposes CRUD operations for the **DigitalPlatform** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DigitalPlatforms
    * const digitalPlatforms = await prisma.digitalPlatform.findMany()
    * ```
    */
  get digitalPlatform(): Prisma.DigitalPlatformDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aspiration`: Exposes CRUD operations for the **Aspiration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Aspirations
    * const aspirations = await prisma.aspiration.findMany()
    * ```
    */
  get aspiration(): Prisma.AspirationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assessment`: Exposes CRUD operations for the **Assessment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assessments
    * const assessments = await prisma.assessment.findMany()
    * ```
    */
  get assessment(): Prisma.AssessmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pillarAssessment`: Exposes CRUD operations for the **PillarAssessment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PillarAssessments
    * const pillarAssessments = await prisma.pillarAssessment.findMany()
    * ```
    */
  get pillarAssessment(): Prisma.PillarAssessmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assessmentResponse`: Exposes CRUD operations for the **AssessmentResponse** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssessmentResponses
    * const assessmentResponses = await prisma.assessmentResponse.findMany()
    * ```
    */
  get assessmentResponse(): Prisma.AssessmentResponseDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.4.1
   * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
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
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
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
    User: 'User',
    FarmerProfile: 'FarmerProfile',
    FarmManagement: 'FarmManagement',
    OperatingStyle: 'OperatingStyle',
    DigitalPlatform: 'DigitalPlatform',
    Aspiration: 'Aspiration',
    Order: 'Order',
    Assessment: 'Assessment',
    PillarAssessment: 'PillarAssessment',
    AssessmentResponse: 'AssessmentResponse'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "farmerProfile" | "farmManagement" | "operatingStyle" | "digitalPlatform" | "aspiration" | "order" | "assessment" | "pillarAssessment" | "assessmentResponse"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      FarmerProfile: {
        payload: Prisma.$FarmerProfilePayload<ExtArgs>
        fields: Prisma.FarmerProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FarmerProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FarmerProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          findFirst: {
            args: Prisma.FarmerProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FarmerProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          findMany: {
            args: Prisma.FarmerProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>[]
          }
          create: {
            args: Prisma.FarmerProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          createMany: {
            args: Prisma.FarmerProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FarmerProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>[]
          }
          delete: {
            args: Prisma.FarmerProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          update: {
            args: Prisma.FarmerProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          deleteMany: {
            args: Prisma.FarmerProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FarmerProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FarmerProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>[]
          }
          upsert: {
            args: Prisma.FarmerProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          aggregate: {
            args: Prisma.FarmerProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFarmerProfile>
          }
          groupBy: {
            args: Prisma.FarmerProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<FarmerProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.FarmerProfileCountArgs<ExtArgs>
            result: $Utils.Optional<FarmerProfileCountAggregateOutputType> | number
          }
        }
      }
      FarmManagement: {
        payload: Prisma.$FarmManagementPayload<ExtArgs>
        fields: Prisma.FarmManagementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FarmManagementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FarmManagementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>
          }
          findFirst: {
            args: Prisma.FarmManagementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FarmManagementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>
          }
          findMany: {
            args: Prisma.FarmManagementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>[]
          }
          create: {
            args: Prisma.FarmManagementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>
          }
          createMany: {
            args: Prisma.FarmManagementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FarmManagementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>[]
          }
          delete: {
            args: Prisma.FarmManagementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>
          }
          update: {
            args: Prisma.FarmManagementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>
          }
          deleteMany: {
            args: Prisma.FarmManagementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FarmManagementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FarmManagementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>[]
          }
          upsert: {
            args: Prisma.FarmManagementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmManagementPayload>
          }
          aggregate: {
            args: Prisma.FarmManagementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFarmManagement>
          }
          groupBy: {
            args: Prisma.FarmManagementGroupByArgs<ExtArgs>
            result: $Utils.Optional<FarmManagementGroupByOutputType>[]
          }
          count: {
            args: Prisma.FarmManagementCountArgs<ExtArgs>
            result: $Utils.Optional<FarmManagementCountAggregateOutputType> | number
          }
        }
      }
      OperatingStyle: {
        payload: Prisma.$OperatingStylePayload<ExtArgs>
        fields: Prisma.OperatingStyleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OperatingStyleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OperatingStyleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>
          }
          findFirst: {
            args: Prisma.OperatingStyleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OperatingStyleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>
          }
          findMany: {
            args: Prisma.OperatingStyleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>[]
          }
          create: {
            args: Prisma.OperatingStyleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>
          }
          createMany: {
            args: Prisma.OperatingStyleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OperatingStyleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>[]
          }
          delete: {
            args: Prisma.OperatingStyleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>
          }
          update: {
            args: Prisma.OperatingStyleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>
          }
          deleteMany: {
            args: Prisma.OperatingStyleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OperatingStyleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OperatingStyleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>[]
          }
          upsert: {
            args: Prisma.OperatingStyleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatingStylePayload>
          }
          aggregate: {
            args: Prisma.OperatingStyleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOperatingStyle>
          }
          groupBy: {
            args: Prisma.OperatingStyleGroupByArgs<ExtArgs>
            result: $Utils.Optional<OperatingStyleGroupByOutputType>[]
          }
          count: {
            args: Prisma.OperatingStyleCountArgs<ExtArgs>
            result: $Utils.Optional<OperatingStyleCountAggregateOutputType> | number
          }
        }
      }
      DigitalPlatform: {
        payload: Prisma.$DigitalPlatformPayload<ExtArgs>
        fields: Prisma.DigitalPlatformFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DigitalPlatformFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DigitalPlatformFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>
          }
          findFirst: {
            args: Prisma.DigitalPlatformFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DigitalPlatformFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>
          }
          findMany: {
            args: Prisma.DigitalPlatformFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>[]
          }
          create: {
            args: Prisma.DigitalPlatformCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>
          }
          createMany: {
            args: Prisma.DigitalPlatformCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DigitalPlatformCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>[]
          }
          delete: {
            args: Prisma.DigitalPlatformDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>
          }
          update: {
            args: Prisma.DigitalPlatformUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>
          }
          deleteMany: {
            args: Prisma.DigitalPlatformDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DigitalPlatformUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DigitalPlatformUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>[]
          }
          upsert: {
            args: Prisma.DigitalPlatformUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DigitalPlatformPayload>
          }
          aggregate: {
            args: Prisma.DigitalPlatformAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDigitalPlatform>
          }
          groupBy: {
            args: Prisma.DigitalPlatformGroupByArgs<ExtArgs>
            result: $Utils.Optional<DigitalPlatformGroupByOutputType>[]
          }
          count: {
            args: Prisma.DigitalPlatformCountArgs<ExtArgs>
            result: $Utils.Optional<DigitalPlatformCountAggregateOutputType> | number
          }
        }
      }
      Aspiration: {
        payload: Prisma.$AspirationPayload<ExtArgs>
        fields: Prisma.AspirationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AspirationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AspirationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>
          }
          findFirst: {
            args: Prisma.AspirationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AspirationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>
          }
          findMany: {
            args: Prisma.AspirationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>[]
          }
          create: {
            args: Prisma.AspirationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>
          }
          createMany: {
            args: Prisma.AspirationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AspirationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>[]
          }
          delete: {
            args: Prisma.AspirationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>
          }
          update: {
            args: Prisma.AspirationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>
          }
          deleteMany: {
            args: Prisma.AspirationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AspirationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AspirationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>[]
          }
          upsert: {
            args: Prisma.AspirationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AspirationPayload>
          }
          aggregate: {
            args: Prisma.AspirationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAspiration>
          }
          groupBy: {
            args: Prisma.AspirationGroupByArgs<ExtArgs>
            result: $Utils.Optional<AspirationGroupByOutputType>[]
          }
          count: {
            args: Prisma.AspirationCountArgs<ExtArgs>
            result: $Utils.Optional<AspirationCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      Assessment: {
        payload: Prisma.$AssessmentPayload<ExtArgs>
        fields: Prisma.AssessmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssessmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssessmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>
          }
          findFirst: {
            args: Prisma.AssessmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssessmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>
          }
          findMany: {
            args: Prisma.AssessmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>[]
          }
          create: {
            args: Prisma.AssessmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>
          }
          createMany: {
            args: Prisma.AssessmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssessmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>[]
          }
          delete: {
            args: Prisma.AssessmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>
          }
          update: {
            args: Prisma.AssessmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>
          }
          deleteMany: {
            args: Prisma.AssessmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssessmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssessmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>[]
          }
          upsert: {
            args: Prisma.AssessmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentPayload>
          }
          aggregate: {
            args: Prisma.AssessmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssessment>
          }
          groupBy: {
            args: Prisma.AssessmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssessmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssessmentCountArgs<ExtArgs>
            result: $Utils.Optional<AssessmentCountAggregateOutputType> | number
          }
        }
      }
      PillarAssessment: {
        payload: Prisma.$PillarAssessmentPayload<ExtArgs>
        fields: Prisma.PillarAssessmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PillarAssessmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PillarAssessmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>
          }
          findFirst: {
            args: Prisma.PillarAssessmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PillarAssessmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>
          }
          findMany: {
            args: Prisma.PillarAssessmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>[]
          }
          create: {
            args: Prisma.PillarAssessmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>
          }
          createMany: {
            args: Prisma.PillarAssessmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PillarAssessmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>[]
          }
          delete: {
            args: Prisma.PillarAssessmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>
          }
          update: {
            args: Prisma.PillarAssessmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>
          }
          deleteMany: {
            args: Prisma.PillarAssessmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PillarAssessmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PillarAssessmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>[]
          }
          upsert: {
            args: Prisma.PillarAssessmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PillarAssessmentPayload>
          }
          aggregate: {
            args: Prisma.PillarAssessmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePillarAssessment>
          }
          groupBy: {
            args: Prisma.PillarAssessmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PillarAssessmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PillarAssessmentCountArgs<ExtArgs>
            result: $Utils.Optional<PillarAssessmentCountAggregateOutputType> | number
          }
        }
      }
      AssessmentResponse: {
        payload: Prisma.$AssessmentResponsePayload<ExtArgs>
        fields: Prisma.AssessmentResponseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssessmentResponseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssessmentResponseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>
          }
          findFirst: {
            args: Prisma.AssessmentResponseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssessmentResponseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>
          }
          findMany: {
            args: Prisma.AssessmentResponseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>[]
          }
          create: {
            args: Prisma.AssessmentResponseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>
          }
          createMany: {
            args: Prisma.AssessmentResponseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssessmentResponseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>[]
          }
          delete: {
            args: Prisma.AssessmentResponseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>
          }
          update: {
            args: Prisma.AssessmentResponseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>
          }
          deleteMany: {
            args: Prisma.AssessmentResponseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssessmentResponseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssessmentResponseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>[]
          }
          upsert: {
            args: Prisma.AssessmentResponseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>
          }
          aggregate: {
            args: Prisma.AssessmentResponseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssessmentResponse>
          }
          groupBy: {
            args: Prisma.AssessmentResponseGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssessmentResponseGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssessmentResponseCountArgs<ExtArgs>
            result: $Utils.Optional<AssessmentResponseCountAggregateOutputType> | number
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
    user?: UserOmit
    farmerProfile?: FarmerProfileOmit
    farmManagement?: FarmManagementOmit
    operatingStyle?: OperatingStyleOmit
    digitalPlatform?: DigitalPlatformOmit
    aspiration?: AspirationOmit
    order?: OrderOmit
    assessment?: AssessmentOmit
    pillarAssessment?: PillarAssessmentOmit
    assessmentResponse?: AssessmentResponseOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    orders: number
    assessments: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | UserCountOutputTypeCountOrdersArgs
    assessments?: boolean | UserCountOutputTypeCountAssessmentsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAssessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssessmentWhereInput
  }


  /**
   * Count Type AssessmentCountOutputType
   */

  export type AssessmentCountOutputType = {
    pillarAssessments: number
    assessmentResponses: number
  }

  export type AssessmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pillarAssessments?: boolean | AssessmentCountOutputTypeCountPillarAssessmentsArgs
    assessmentResponses?: boolean | AssessmentCountOutputTypeCountAssessmentResponsesArgs
  }

  // Custom InputTypes
  /**
   * AssessmentCountOutputType without action
   */
  export type AssessmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentCountOutputType
     */
    select?: AssessmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AssessmentCountOutputType without action
   */
  export type AssessmentCountOutputTypeCountPillarAssessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PillarAssessmentWhereInput
  }

  /**
   * AssessmentCountOutputType without action
   */
  export type AssessmentCountOutputTypeCountAssessmentResponsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssessmentResponseWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    phone: string | null
    farmName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    phone: string | null
    farmName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    phone: number
    farmName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    phone?: true
    farmName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    phone?: true
    farmName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    phone?: true
    farmName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    phone: string | null
    farmName: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    phone?: boolean
    farmName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    farmerProfile?: boolean | User$farmerProfileArgs<ExtArgs>
    farmManagement?: boolean | User$farmManagementArgs<ExtArgs>
    operatingStyle?: boolean | User$operatingStyleArgs<ExtArgs>
    digitalPlatform?: boolean | User$digitalPlatformArgs<ExtArgs>
    aspiration?: boolean | User$aspirationArgs<ExtArgs>
    orders?: boolean | User$ordersArgs<ExtArgs>
    assessments?: boolean | User$assessmentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    phone?: boolean
    farmName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    phone?: boolean
    farmName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    phone?: boolean
    farmName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "phone" | "farmName" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    farmerProfile?: boolean | User$farmerProfileArgs<ExtArgs>
    farmManagement?: boolean | User$farmManagementArgs<ExtArgs>
    operatingStyle?: boolean | User$operatingStyleArgs<ExtArgs>
    digitalPlatform?: boolean | User$digitalPlatformArgs<ExtArgs>
    aspiration?: boolean | User$aspirationArgs<ExtArgs>
    orders?: boolean | User$ordersArgs<ExtArgs>
    assessments?: boolean | User$assessmentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      farmerProfile: Prisma.$FarmerProfilePayload<ExtArgs> | null
      farmManagement: Prisma.$FarmManagementPayload<ExtArgs> | null
      operatingStyle: Prisma.$OperatingStylePayload<ExtArgs> | null
      digitalPlatform: Prisma.$DigitalPlatformPayload<ExtArgs> | null
      aspiration: Prisma.$AspirationPayload<ExtArgs> | null
      orders: Prisma.$OrderPayload<ExtArgs>[]
      assessments: Prisma.$AssessmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      passwordHash: string
      phone: string | null
      farmName: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    farmerProfile<T extends User$farmerProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$farmerProfileArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | null, null, ExtArgs, ClientOptions>
    farmManagement<T extends User$farmManagementArgs<ExtArgs> = {}>(args?: Subset<T, User$farmManagementArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | null, null, ExtArgs, ClientOptions>
    operatingStyle<T extends User$operatingStyleArgs<ExtArgs> = {}>(args?: Subset<T, User$operatingStyleArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | null, null, ExtArgs, ClientOptions>
    digitalPlatform<T extends User$digitalPlatformArgs<ExtArgs> = {}>(args?: Subset<T, User$digitalPlatformArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | null, null, ExtArgs, ClientOptions>
    aspiration<T extends User$aspirationArgs<ExtArgs> = {}>(args?: Subset<T, User$aspirationArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | null, null, ExtArgs, ClientOptions>
    orders<T extends User$ordersArgs<ExtArgs> = {}>(args?: Subset<T, User$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", ClientOptions> | Null>
    assessments<T extends User$assessmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$assessmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "findMany", ClientOptions> | Null>
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
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly farmName: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.farmerProfile
   */
  export type User$farmerProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    where?: FarmerProfileWhereInput
  }

  /**
   * User.farmManagement
   */
  export type User$farmManagementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    where?: FarmManagementWhereInput
  }

  /**
   * User.operatingStyle
   */
  export type User$operatingStyleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    where?: OperatingStyleWhereInput
  }

  /**
   * User.digitalPlatform
   */
  export type User$digitalPlatformArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    where?: DigitalPlatformWhereInput
  }

  /**
   * User.aspiration
   */
  export type User$aspirationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    where?: AspirationWhereInput
  }

  /**
   * User.orders
   */
  export type User$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User.assessments
   */
  export type User$assessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    where?: AssessmentWhereInput
    orderBy?: AssessmentOrderByWithRelationInput | AssessmentOrderByWithRelationInput[]
    cursor?: AssessmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssessmentScalarFieldEnum | AssessmentScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model FarmerProfile
   */

  export type AggregateFarmerProfile = {
    _count: FarmerProfileCountAggregateOutputType | null
    _min: FarmerProfileMinAggregateOutputType | null
    _max: FarmerProfileMaxAggregateOutputType | null
  }

  export type FarmerProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    jobTitle: string | null
    valueChain: string | null
    experienceYears: string | null
    businessHistory: string | null
    educationLevel: string | null
    education: string | null
    otherEducation: string | null
    updatedAt: Date | null
  }

  export type FarmerProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    jobTitle: string | null
    valueChain: string | null
    experienceYears: string | null
    businessHistory: string | null
    educationLevel: string | null
    education: string | null
    otherEducation: string | null
    updatedAt: Date | null
  }

  export type FarmerProfileCountAggregateOutputType = {
    id: number
    userId: number
    jobTitle: number
    valueChain: number
    experienceYears: number
    businessHistory: number
    educationLevel: number
    education: number
    otherEducation: number
    updatedAt: number
    _all: number
  }


  export type FarmerProfileMinAggregateInputType = {
    id?: true
    userId?: true
    jobTitle?: true
    valueChain?: true
    experienceYears?: true
    businessHistory?: true
    educationLevel?: true
    education?: true
    otherEducation?: true
    updatedAt?: true
  }

  export type FarmerProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    jobTitle?: true
    valueChain?: true
    experienceYears?: true
    businessHistory?: true
    educationLevel?: true
    education?: true
    otherEducation?: true
    updatedAt?: true
  }

  export type FarmerProfileCountAggregateInputType = {
    id?: true
    userId?: true
    jobTitle?: true
    valueChain?: true
    experienceYears?: true
    businessHistory?: true
    educationLevel?: true
    education?: true
    otherEducation?: true
    updatedAt?: true
    _all?: true
  }

  export type FarmerProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FarmerProfile to aggregate.
     */
    where?: FarmerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmerProfiles to fetch.
     */
    orderBy?: FarmerProfileOrderByWithRelationInput | FarmerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FarmerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FarmerProfiles
    **/
    _count?: true | FarmerProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FarmerProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FarmerProfileMaxAggregateInputType
  }

  export type GetFarmerProfileAggregateType<T extends FarmerProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateFarmerProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFarmerProfile[P]>
      : GetScalarType<T[P], AggregateFarmerProfile[P]>
  }




  export type FarmerProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FarmerProfileWhereInput
    orderBy?: FarmerProfileOrderByWithAggregationInput | FarmerProfileOrderByWithAggregationInput[]
    by: FarmerProfileScalarFieldEnum[] | FarmerProfileScalarFieldEnum
    having?: FarmerProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FarmerProfileCountAggregateInputType | true
    _min?: FarmerProfileMinAggregateInputType
    _max?: FarmerProfileMaxAggregateInputType
  }

  export type FarmerProfileGroupByOutputType = {
    id: string
    userId: string
    jobTitle: string | null
    valueChain: string | null
    experienceYears: string | null
    businessHistory: string | null
    educationLevel: string | null
    education: string | null
    otherEducation: string | null
    updatedAt: Date
    _count: FarmerProfileCountAggregateOutputType | null
    _min: FarmerProfileMinAggregateOutputType | null
    _max: FarmerProfileMaxAggregateOutputType | null
  }

  type GetFarmerProfileGroupByPayload<T extends FarmerProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FarmerProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FarmerProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FarmerProfileGroupByOutputType[P]>
            : GetScalarType<T[P], FarmerProfileGroupByOutputType[P]>
        }
      >
    >


  export type FarmerProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobTitle?: boolean
    valueChain?: boolean
    experienceYears?: boolean
    businessHistory?: boolean
    educationLevel?: boolean
    education?: boolean
    otherEducation?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["farmerProfile"]>

  export type FarmerProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobTitle?: boolean
    valueChain?: boolean
    experienceYears?: boolean
    businessHistory?: boolean
    educationLevel?: boolean
    education?: boolean
    otherEducation?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["farmerProfile"]>

  export type FarmerProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobTitle?: boolean
    valueChain?: boolean
    experienceYears?: boolean
    businessHistory?: boolean
    educationLevel?: boolean
    education?: boolean
    otherEducation?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["farmerProfile"]>

  export type FarmerProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    jobTitle?: boolean
    valueChain?: boolean
    experienceYears?: boolean
    businessHistory?: boolean
    educationLevel?: boolean
    education?: boolean
    otherEducation?: boolean
    updatedAt?: boolean
  }

  export type FarmerProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "jobTitle" | "valueChain" | "experienceYears" | "businessHistory" | "educationLevel" | "education" | "otherEducation" | "updatedAt", ExtArgs["result"]["farmerProfile"]>
  export type FarmerProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FarmerProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FarmerProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FarmerProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FarmerProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      jobTitle: string | null
      valueChain: string | null
      experienceYears: string | null
      businessHistory: string | null
      educationLevel: string | null
      education: string | null
      otherEducation: string | null
      updatedAt: Date
    }, ExtArgs["result"]["farmerProfile"]>
    composites: {}
  }

  type FarmerProfileGetPayload<S extends boolean | null | undefined | FarmerProfileDefaultArgs> = $Result.GetResult<Prisma.$FarmerProfilePayload, S>

  type FarmerProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FarmerProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FarmerProfileCountAggregateInputType | true
    }

  export interface FarmerProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FarmerProfile'], meta: { name: 'FarmerProfile' } }
    /**
     * Find zero or one FarmerProfile that matches the filter.
     * @param {FarmerProfileFindUniqueArgs} args - Arguments to find a FarmerProfile
     * @example
     * // Get one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FarmerProfileFindUniqueArgs>(args: SelectSubset<T, FarmerProfileFindUniqueArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one FarmerProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FarmerProfileFindUniqueOrThrowArgs} args - Arguments to find a FarmerProfile
     * @example
     * // Get one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FarmerProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, FarmerProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first FarmerProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileFindFirstArgs} args - Arguments to find a FarmerProfile
     * @example
     * // Get one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FarmerProfileFindFirstArgs>(args?: SelectSubset<T, FarmerProfileFindFirstArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first FarmerProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileFindFirstOrThrowArgs} args - Arguments to find a FarmerProfile
     * @example
     * // Get one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FarmerProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, FarmerProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more FarmerProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FarmerProfiles
     * const farmerProfiles = await prisma.farmerProfile.findMany()
     * 
     * // Get first 10 FarmerProfiles
     * const farmerProfiles = await prisma.farmerProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const farmerProfileWithIdOnly = await prisma.farmerProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FarmerProfileFindManyArgs>(args?: SelectSubset<T, FarmerProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a FarmerProfile.
     * @param {FarmerProfileCreateArgs} args - Arguments to create a FarmerProfile.
     * @example
     * // Create one FarmerProfile
     * const FarmerProfile = await prisma.farmerProfile.create({
     *   data: {
     *     // ... data to create a FarmerProfile
     *   }
     * })
     * 
     */
    create<T extends FarmerProfileCreateArgs>(args: SelectSubset<T, FarmerProfileCreateArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many FarmerProfiles.
     * @param {FarmerProfileCreateManyArgs} args - Arguments to create many FarmerProfiles.
     * @example
     * // Create many FarmerProfiles
     * const farmerProfile = await prisma.farmerProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FarmerProfileCreateManyArgs>(args?: SelectSubset<T, FarmerProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FarmerProfiles and returns the data saved in the database.
     * @param {FarmerProfileCreateManyAndReturnArgs} args - Arguments to create many FarmerProfiles.
     * @example
     * // Create many FarmerProfiles
     * const farmerProfile = await prisma.farmerProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FarmerProfiles and only return the `id`
     * const farmerProfileWithIdOnly = await prisma.farmerProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FarmerProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, FarmerProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a FarmerProfile.
     * @param {FarmerProfileDeleteArgs} args - Arguments to delete one FarmerProfile.
     * @example
     * // Delete one FarmerProfile
     * const FarmerProfile = await prisma.farmerProfile.delete({
     *   where: {
     *     // ... filter to delete one FarmerProfile
     *   }
     * })
     * 
     */
    delete<T extends FarmerProfileDeleteArgs>(args: SelectSubset<T, FarmerProfileDeleteArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one FarmerProfile.
     * @param {FarmerProfileUpdateArgs} args - Arguments to update one FarmerProfile.
     * @example
     * // Update one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FarmerProfileUpdateArgs>(args: SelectSubset<T, FarmerProfileUpdateArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more FarmerProfiles.
     * @param {FarmerProfileDeleteManyArgs} args - Arguments to filter FarmerProfiles to delete.
     * @example
     * // Delete a few FarmerProfiles
     * const { count } = await prisma.farmerProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FarmerProfileDeleteManyArgs>(args?: SelectSubset<T, FarmerProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FarmerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FarmerProfiles
     * const farmerProfile = await prisma.farmerProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FarmerProfileUpdateManyArgs>(args: SelectSubset<T, FarmerProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FarmerProfiles and returns the data updated in the database.
     * @param {FarmerProfileUpdateManyAndReturnArgs} args - Arguments to update many FarmerProfiles.
     * @example
     * // Update many FarmerProfiles
     * const farmerProfile = await prisma.farmerProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FarmerProfiles and only return the `id`
     * const farmerProfileWithIdOnly = await prisma.farmerProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FarmerProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, FarmerProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one FarmerProfile.
     * @param {FarmerProfileUpsertArgs} args - Arguments to update or create a FarmerProfile.
     * @example
     * // Update or create a FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.upsert({
     *   create: {
     *     // ... data to create a FarmerProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FarmerProfile we want to update
     *   }
     * })
     */
    upsert<T extends FarmerProfileUpsertArgs>(args: SelectSubset<T, FarmerProfileUpsertArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of FarmerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileCountArgs} args - Arguments to filter FarmerProfiles to count.
     * @example
     * // Count the number of FarmerProfiles
     * const count = await prisma.farmerProfile.count({
     *   where: {
     *     // ... the filter for the FarmerProfiles we want to count
     *   }
     * })
    **/
    count<T extends FarmerProfileCountArgs>(
      args?: Subset<T, FarmerProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FarmerProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FarmerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FarmerProfileAggregateArgs>(args: Subset<T, FarmerProfileAggregateArgs>): Prisma.PrismaPromise<GetFarmerProfileAggregateType<T>>

    /**
     * Group by FarmerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileGroupByArgs} args - Group by arguments.
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
      T extends FarmerProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FarmerProfileGroupByArgs['orderBy'] }
        : { orderBy?: FarmerProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FarmerProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFarmerProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FarmerProfile model
   */
  readonly fields: FarmerProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FarmerProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FarmerProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
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
   * Fields of the FarmerProfile model
   */ 
  interface FarmerProfileFieldRefs {
    readonly id: FieldRef<"FarmerProfile", 'String'>
    readonly userId: FieldRef<"FarmerProfile", 'String'>
    readonly jobTitle: FieldRef<"FarmerProfile", 'String'>
    readonly valueChain: FieldRef<"FarmerProfile", 'String'>
    readonly experienceYears: FieldRef<"FarmerProfile", 'String'>
    readonly businessHistory: FieldRef<"FarmerProfile", 'String'>
    readonly educationLevel: FieldRef<"FarmerProfile", 'String'>
    readonly education: FieldRef<"FarmerProfile", 'String'>
    readonly otherEducation: FieldRef<"FarmerProfile", 'String'>
    readonly updatedAt: FieldRef<"FarmerProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FarmerProfile findUnique
   */
  export type FarmerProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * Filter, which FarmerProfile to fetch.
     */
    where: FarmerProfileWhereUniqueInput
  }

  /**
   * FarmerProfile findUniqueOrThrow
   */
  export type FarmerProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * Filter, which FarmerProfile to fetch.
     */
    where: FarmerProfileWhereUniqueInput
  }

  /**
   * FarmerProfile findFirst
   */
  export type FarmerProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * Filter, which FarmerProfile to fetch.
     */
    where?: FarmerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmerProfiles to fetch.
     */
    orderBy?: FarmerProfileOrderByWithRelationInput | FarmerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FarmerProfiles.
     */
    cursor?: FarmerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FarmerProfiles.
     */
    distinct?: FarmerProfileScalarFieldEnum | FarmerProfileScalarFieldEnum[]
  }

  /**
   * FarmerProfile findFirstOrThrow
   */
  export type FarmerProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * Filter, which FarmerProfile to fetch.
     */
    where?: FarmerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmerProfiles to fetch.
     */
    orderBy?: FarmerProfileOrderByWithRelationInput | FarmerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FarmerProfiles.
     */
    cursor?: FarmerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FarmerProfiles.
     */
    distinct?: FarmerProfileScalarFieldEnum | FarmerProfileScalarFieldEnum[]
  }

  /**
   * FarmerProfile findMany
   */
  export type FarmerProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * Filter, which FarmerProfiles to fetch.
     */
    where?: FarmerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmerProfiles to fetch.
     */
    orderBy?: FarmerProfileOrderByWithRelationInput | FarmerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FarmerProfiles.
     */
    cursor?: FarmerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmerProfiles.
     */
    skip?: number
    distinct?: FarmerProfileScalarFieldEnum | FarmerProfileScalarFieldEnum[]
  }

  /**
   * FarmerProfile create
   */
  export type FarmerProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a FarmerProfile.
     */
    data: XOR<FarmerProfileCreateInput, FarmerProfileUncheckedCreateInput>
  }

  /**
   * FarmerProfile createMany
   */
  export type FarmerProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FarmerProfiles.
     */
    data: FarmerProfileCreateManyInput | FarmerProfileCreateManyInput[]
  }

  /**
   * FarmerProfile createManyAndReturn
   */
  export type FarmerProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * The data used to create many FarmerProfiles.
     */
    data: FarmerProfileCreateManyInput | FarmerProfileCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FarmerProfile update
   */
  export type FarmerProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a FarmerProfile.
     */
    data: XOR<FarmerProfileUpdateInput, FarmerProfileUncheckedUpdateInput>
    /**
     * Choose, which FarmerProfile to update.
     */
    where: FarmerProfileWhereUniqueInput
  }

  /**
   * FarmerProfile updateMany
   */
  export type FarmerProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FarmerProfiles.
     */
    data: XOR<FarmerProfileUpdateManyMutationInput, FarmerProfileUncheckedUpdateManyInput>
    /**
     * Filter which FarmerProfiles to update
     */
    where?: FarmerProfileWhereInput
    /**
     * Limit how many FarmerProfiles to update.
     */
    limit?: number
  }

  /**
   * FarmerProfile updateManyAndReturn
   */
  export type FarmerProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * The data used to update FarmerProfiles.
     */
    data: XOR<FarmerProfileUpdateManyMutationInput, FarmerProfileUncheckedUpdateManyInput>
    /**
     * Filter which FarmerProfiles to update
     */
    where?: FarmerProfileWhereInput
    /**
     * Limit how many FarmerProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FarmerProfile upsert
   */
  export type FarmerProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the FarmerProfile to update in case it exists.
     */
    where: FarmerProfileWhereUniqueInput
    /**
     * In case the FarmerProfile found by the `where` argument doesn't exist, create a new FarmerProfile with this data.
     */
    create: XOR<FarmerProfileCreateInput, FarmerProfileUncheckedCreateInput>
    /**
     * In case the FarmerProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FarmerProfileUpdateInput, FarmerProfileUncheckedUpdateInput>
  }

  /**
   * FarmerProfile delete
   */
  export type FarmerProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
    /**
     * Filter which FarmerProfile to delete.
     */
    where: FarmerProfileWhereUniqueInput
  }

  /**
   * FarmerProfile deleteMany
   */
  export type FarmerProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FarmerProfiles to delete
     */
    where?: FarmerProfileWhereInput
    /**
     * Limit how many FarmerProfiles to delete.
     */
    limit?: number
  }

  /**
   * FarmerProfile without action
   */
  export type FarmerProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmerProfileInclude<ExtArgs> | null
  }


  /**
   * Model FarmManagement
   */

  export type AggregateFarmManagement = {
    _count: FarmManagementCountAggregateOutputType | null
    _min: FarmManagementMinAggregateOutputType | null
    _max: FarmManagementMaxAggregateOutputType | null
  }

  export type FarmManagementMinAggregateOutputType = {
    id: string | null
    userId: string | null
    mgmtAbility: string | null
    operationsResponsible: string | null
    opsResponsibility: string | null
    operators: string | null
    otherOperator: string | null
    desiredInvolvement: string | null
    updatedAt: Date | null
  }

  export type FarmManagementMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    mgmtAbility: string | null
    operationsResponsible: string | null
    opsResponsibility: string | null
    operators: string | null
    otherOperator: string | null
    desiredInvolvement: string | null
    updatedAt: Date | null
  }

  export type FarmManagementCountAggregateOutputType = {
    id: number
    userId: number
    mgmtAbility: number
    operationsResponsible: number
    opsResponsibility: number
    operators: number
    otherOperator: number
    desiredInvolvement: number
    updatedAt: number
    _all: number
  }


  export type FarmManagementMinAggregateInputType = {
    id?: true
    userId?: true
    mgmtAbility?: true
    operationsResponsible?: true
    opsResponsibility?: true
    operators?: true
    otherOperator?: true
    desiredInvolvement?: true
    updatedAt?: true
  }

  export type FarmManagementMaxAggregateInputType = {
    id?: true
    userId?: true
    mgmtAbility?: true
    operationsResponsible?: true
    opsResponsibility?: true
    operators?: true
    otherOperator?: true
    desiredInvolvement?: true
    updatedAt?: true
  }

  export type FarmManagementCountAggregateInputType = {
    id?: true
    userId?: true
    mgmtAbility?: true
    operationsResponsible?: true
    opsResponsibility?: true
    operators?: true
    otherOperator?: true
    desiredInvolvement?: true
    updatedAt?: true
    _all?: true
  }

  export type FarmManagementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FarmManagement to aggregate.
     */
    where?: FarmManagementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmManagements to fetch.
     */
    orderBy?: FarmManagementOrderByWithRelationInput | FarmManagementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FarmManagementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmManagements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmManagements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FarmManagements
    **/
    _count?: true | FarmManagementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FarmManagementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FarmManagementMaxAggregateInputType
  }

  export type GetFarmManagementAggregateType<T extends FarmManagementAggregateArgs> = {
        [P in keyof T & keyof AggregateFarmManagement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFarmManagement[P]>
      : GetScalarType<T[P], AggregateFarmManagement[P]>
  }




  export type FarmManagementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FarmManagementWhereInput
    orderBy?: FarmManagementOrderByWithAggregationInput | FarmManagementOrderByWithAggregationInput[]
    by: FarmManagementScalarFieldEnum[] | FarmManagementScalarFieldEnum
    having?: FarmManagementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FarmManagementCountAggregateInputType | true
    _min?: FarmManagementMinAggregateInputType
    _max?: FarmManagementMaxAggregateInputType
  }

  export type FarmManagementGroupByOutputType = {
    id: string
    userId: string
    mgmtAbility: string | null
    operationsResponsible: string | null
    opsResponsibility: string | null
    operators: string | null
    otherOperator: string | null
    desiredInvolvement: string | null
    updatedAt: Date
    _count: FarmManagementCountAggregateOutputType | null
    _min: FarmManagementMinAggregateOutputType | null
    _max: FarmManagementMaxAggregateOutputType | null
  }

  type GetFarmManagementGroupByPayload<T extends FarmManagementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FarmManagementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FarmManagementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FarmManagementGroupByOutputType[P]>
            : GetScalarType<T[P], FarmManagementGroupByOutputType[P]>
        }
      >
    >


  export type FarmManagementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mgmtAbility?: boolean
    operationsResponsible?: boolean
    opsResponsibility?: boolean
    operators?: boolean
    otherOperator?: boolean
    desiredInvolvement?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["farmManagement"]>

  export type FarmManagementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mgmtAbility?: boolean
    operationsResponsible?: boolean
    opsResponsibility?: boolean
    operators?: boolean
    otherOperator?: boolean
    desiredInvolvement?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["farmManagement"]>

  export type FarmManagementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mgmtAbility?: boolean
    operationsResponsible?: boolean
    opsResponsibility?: boolean
    operators?: boolean
    otherOperator?: boolean
    desiredInvolvement?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["farmManagement"]>

  export type FarmManagementSelectScalar = {
    id?: boolean
    userId?: boolean
    mgmtAbility?: boolean
    operationsResponsible?: boolean
    opsResponsibility?: boolean
    operators?: boolean
    otherOperator?: boolean
    desiredInvolvement?: boolean
    updatedAt?: boolean
  }

  export type FarmManagementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "mgmtAbility" | "operationsResponsible" | "opsResponsibility" | "operators" | "otherOperator" | "desiredInvolvement" | "updatedAt", ExtArgs["result"]["farmManagement"]>
  export type FarmManagementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FarmManagementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FarmManagementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FarmManagementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FarmManagement"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      mgmtAbility: string | null
      operationsResponsible: string | null
      opsResponsibility: string | null
      operators: string | null
      otherOperator: string | null
      desiredInvolvement: string | null
      updatedAt: Date
    }, ExtArgs["result"]["farmManagement"]>
    composites: {}
  }

  type FarmManagementGetPayload<S extends boolean | null | undefined | FarmManagementDefaultArgs> = $Result.GetResult<Prisma.$FarmManagementPayload, S>

  type FarmManagementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FarmManagementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FarmManagementCountAggregateInputType | true
    }

  export interface FarmManagementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FarmManagement'], meta: { name: 'FarmManagement' } }
    /**
     * Find zero or one FarmManagement that matches the filter.
     * @param {FarmManagementFindUniqueArgs} args - Arguments to find a FarmManagement
     * @example
     * // Get one FarmManagement
     * const farmManagement = await prisma.farmManagement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FarmManagementFindUniqueArgs>(args: SelectSubset<T, FarmManagementFindUniqueArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one FarmManagement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FarmManagementFindUniqueOrThrowArgs} args - Arguments to find a FarmManagement
     * @example
     * // Get one FarmManagement
     * const farmManagement = await prisma.farmManagement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FarmManagementFindUniqueOrThrowArgs>(args: SelectSubset<T, FarmManagementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first FarmManagement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmManagementFindFirstArgs} args - Arguments to find a FarmManagement
     * @example
     * // Get one FarmManagement
     * const farmManagement = await prisma.farmManagement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FarmManagementFindFirstArgs>(args?: SelectSubset<T, FarmManagementFindFirstArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first FarmManagement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmManagementFindFirstOrThrowArgs} args - Arguments to find a FarmManagement
     * @example
     * // Get one FarmManagement
     * const farmManagement = await prisma.farmManagement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FarmManagementFindFirstOrThrowArgs>(args?: SelectSubset<T, FarmManagementFindFirstOrThrowArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more FarmManagements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmManagementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FarmManagements
     * const farmManagements = await prisma.farmManagement.findMany()
     * 
     * // Get first 10 FarmManagements
     * const farmManagements = await prisma.farmManagement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const farmManagementWithIdOnly = await prisma.farmManagement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FarmManagementFindManyArgs>(args?: SelectSubset<T, FarmManagementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a FarmManagement.
     * @param {FarmManagementCreateArgs} args - Arguments to create a FarmManagement.
     * @example
     * // Create one FarmManagement
     * const FarmManagement = await prisma.farmManagement.create({
     *   data: {
     *     // ... data to create a FarmManagement
     *   }
     * })
     * 
     */
    create<T extends FarmManagementCreateArgs>(args: SelectSubset<T, FarmManagementCreateArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many FarmManagements.
     * @param {FarmManagementCreateManyArgs} args - Arguments to create many FarmManagements.
     * @example
     * // Create many FarmManagements
     * const farmManagement = await prisma.farmManagement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FarmManagementCreateManyArgs>(args?: SelectSubset<T, FarmManagementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FarmManagements and returns the data saved in the database.
     * @param {FarmManagementCreateManyAndReturnArgs} args - Arguments to create many FarmManagements.
     * @example
     * // Create many FarmManagements
     * const farmManagement = await prisma.farmManagement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FarmManagements and only return the `id`
     * const farmManagementWithIdOnly = await prisma.farmManagement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FarmManagementCreateManyAndReturnArgs>(args?: SelectSubset<T, FarmManagementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a FarmManagement.
     * @param {FarmManagementDeleteArgs} args - Arguments to delete one FarmManagement.
     * @example
     * // Delete one FarmManagement
     * const FarmManagement = await prisma.farmManagement.delete({
     *   where: {
     *     // ... filter to delete one FarmManagement
     *   }
     * })
     * 
     */
    delete<T extends FarmManagementDeleteArgs>(args: SelectSubset<T, FarmManagementDeleteArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one FarmManagement.
     * @param {FarmManagementUpdateArgs} args - Arguments to update one FarmManagement.
     * @example
     * // Update one FarmManagement
     * const farmManagement = await prisma.farmManagement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FarmManagementUpdateArgs>(args: SelectSubset<T, FarmManagementUpdateArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more FarmManagements.
     * @param {FarmManagementDeleteManyArgs} args - Arguments to filter FarmManagements to delete.
     * @example
     * // Delete a few FarmManagements
     * const { count } = await prisma.farmManagement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FarmManagementDeleteManyArgs>(args?: SelectSubset<T, FarmManagementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FarmManagements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmManagementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FarmManagements
     * const farmManagement = await prisma.farmManagement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FarmManagementUpdateManyArgs>(args: SelectSubset<T, FarmManagementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FarmManagements and returns the data updated in the database.
     * @param {FarmManagementUpdateManyAndReturnArgs} args - Arguments to update many FarmManagements.
     * @example
     * // Update many FarmManagements
     * const farmManagement = await prisma.farmManagement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FarmManagements and only return the `id`
     * const farmManagementWithIdOnly = await prisma.farmManagement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FarmManagementUpdateManyAndReturnArgs>(args: SelectSubset<T, FarmManagementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one FarmManagement.
     * @param {FarmManagementUpsertArgs} args - Arguments to update or create a FarmManagement.
     * @example
     * // Update or create a FarmManagement
     * const farmManagement = await prisma.farmManagement.upsert({
     *   create: {
     *     // ... data to create a FarmManagement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FarmManagement we want to update
     *   }
     * })
     */
    upsert<T extends FarmManagementUpsertArgs>(args: SelectSubset<T, FarmManagementUpsertArgs<ExtArgs>>): Prisma__FarmManagementClient<$Result.GetResult<Prisma.$FarmManagementPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of FarmManagements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmManagementCountArgs} args - Arguments to filter FarmManagements to count.
     * @example
     * // Count the number of FarmManagements
     * const count = await prisma.farmManagement.count({
     *   where: {
     *     // ... the filter for the FarmManagements we want to count
     *   }
     * })
    **/
    count<T extends FarmManagementCountArgs>(
      args?: Subset<T, FarmManagementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FarmManagementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FarmManagement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmManagementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FarmManagementAggregateArgs>(args: Subset<T, FarmManagementAggregateArgs>): Prisma.PrismaPromise<GetFarmManagementAggregateType<T>>

    /**
     * Group by FarmManagement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmManagementGroupByArgs} args - Group by arguments.
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
      T extends FarmManagementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FarmManagementGroupByArgs['orderBy'] }
        : { orderBy?: FarmManagementGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FarmManagementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFarmManagementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FarmManagement model
   */
  readonly fields: FarmManagementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FarmManagement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FarmManagementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
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
   * Fields of the FarmManagement model
   */ 
  interface FarmManagementFieldRefs {
    readonly id: FieldRef<"FarmManagement", 'String'>
    readonly userId: FieldRef<"FarmManagement", 'String'>
    readonly mgmtAbility: FieldRef<"FarmManagement", 'String'>
    readonly operationsResponsible: FieldRef<"FarmManagement", 'String'>
    readonly opsResponsibility: FieldRef<"FarmManagement", 'String'>
    readonly operators: FieldRef<"FarmManagement", 'String'>
    readonly otherOperator: FieldRef<"FarmManagement", 'String'>
    readonly desiredInvolvement: FieldRef<"FarmManagement", 'String'>
    readonly updatedAt: FieldRef<"FarmManagement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FarmManagement findUnique
   */
  export type FarmManagementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * Filter, which FarmManagement to fetch.
     */
    where: FarmManagementWhereUniqueInput
  }

  /**
   * FarmManagement findUniqueOrThrow
   */
  export type FarmManagementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * Filter, which FarmManagement to fetch.
     */
    where: FarmManagementWhereUniqueInput
  }

  /**
   * FarmManagement findFirst
   */
  export type FarmManagementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * Filter, which FarmManagement to fetch.
     */
    where?: FarmManagementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmManagements to fetch.
     */
    orderBy?: FarmManagementOrderByWithRelationInput | FarmManagementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FarmManagements.
     */
    cursor?: FarmManagementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmManagements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmManagements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FarmManagements.
     */
    distinct?: FarmManagementScalarFieldEnum | FarmManagementScalarFieldEnum[]
  }

  /**
   * FarmManagement findFirstOrThrow
   */
  export type FarmManagementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * Filter, which FarmManagement to fetch.
     */
    where?: FarmManagementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmManagements to fetch.
     */
    orderBy?: FarmManagementOrderByWithRelationInput | FarmManagementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FarmManagements.
     */
    cursor?: FarmManagementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmManagements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmManagements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FarmManagements.
     */
    distinct?: FarmManagementScalarFieldEnum | FarmManagementScalarFieldEnum[]
  }

  /**
   * FarmManagement findMany
   */
  export type FarmManagementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * Filter, which FarmManagements to fetch.
     */
    where?: FarmManagementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmManagements to fetch.
     */
    orderBy?: FarmManagementOrderByWithRelationInput | FarmManagementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FarmManagements.
     */
    cursor?: FarmManagementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmManagements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmManagements.
     */
    skip?: number
    distinct?: FarmManagementScalarFieldEnum | FarmManagementScalarFieldEnum[]
  }

  /**
   * FarmManagement create
   */
  export type FarmManagementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * The data needed to create a FarmManagement.
     */
    data: XOR<FarmManagementCreateInput, FarmManagementUncheckedCreateInput>
  }

  /**
   * FarmManagement createMany
   */
  export type FarmManagementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FarmManagements.
     */
    data: FarmManagementCreateManyInput | FarmManagementCreateManyInput[]
  }

  /**
   * FarmManagement createManyAndReturn
   */
  export type FarmManagementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * The data used to create many FarmManagements.
     */
    data: FarmManagementCreateManyInput | FarmManagementCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FarmManagement update
   */
  export type FarmManagementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * The data needed to update a FarmManagement.
     */
    data: XOR<FarmManagementUpdateInput, FarmManagementUncheckedUpdateInput>
    /**
     * Choose, which FarmManagement to update.
     */
    where: FarmManagementWhereUniqueInput
  }

  /**
   * FarmManagement updateMany
   */
  export type FarmManagementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FarmManagements.
     */
    data: XOR<FarmManagementUpdateManyMutationInput, FarmManagementUncheckedUpdateManyInput>
    /**
     * Filter which FarmManagements to update
     */
    where?: FarmManagementWhereInput
    /**
     * Limit how many FarmManagements to update.
     */
    limit?: number
  }

  /**
   * FarmManagement updateManyAndReturn
   */
  export type FarmManagementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * The data used to update FarmManagements.
     */
    data: XOR<FarmManagementUpdateManyMutationInput, FarmManagementUncheckedUpdateManyInput>
    /**
     * Filter which FarmManagements to update
     */
    where?: FarmManagementWhereInput
    /**
     * Limit how many FarmManagements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FarmManagement upsert
   */
  export type FarmManagementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * The filter to search for the FarmManagement to update in case it exists.
     */
    where: FarmManagementWhereUniqueInput
    /**
     * In case the FarmManagement found by the `where` argument doesn't exist, create a new FarmManagement with this data.
     */
    create: XOR<FarmManagementCreateInput, FarmManagementUncheckedCreateInput>
    /**
     * In case the FarmManagement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FarmManagementUpdateInput, FarmManagementUncheckedUpdateInput>
  }

  /**
   * FarmManagement delete
   */
  export type FarmManagementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
    /**
     * Filter which FarmManagement to delete.
     */
    where: FarmManagementWhereUniqueInput
  }

  /**
   * FarmManagement deleteMany
   */
  export type FarmManagementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FarmManagements to delete
     */
    where?: FarmManagementWhereInput
    /**
     * Limit how many FarmManagements to delete.
     */
    limit?: number
  }

  /**
   * FarmManagement without action
   */
  export type FarmManagementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmManagement
     */
    select?: FarmManagementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmManagement
     */
    omit?: FarmManagementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FarmManagementInclude<ExtArgs> | null
  }


  /**
   * Model OperatingStyle
   */

  export type AggregateOperatingStyle = {
    _count: OperatingStyleCountAggregateOutputType | null
    _min: OperatingStyleMinAggregateOutputType | null
    _max: OperatingStyleMaxAggregateOutputType | null
  }

  export type OperatingStyleMinAggregateOutputType = {
    id: string | null
    userId: string | null
    decisionStyle: string | null
    failureResponse: string | null
    obstacles: string | null
    otherObstacle: string | null
    guidancePreference: string | null
    trackingFrequency: string | null
    updatePreferences: string | null
    updatePreference: string | null
    communicationChannels: string | null
    updatedAt: Date | null
  }

  export type OperatingStyleMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    decisionStyle: string | null
    failureResponse: string | null
    obstacles: string | null
    otherObstacle: string | null
    guidancePreference: string | null
    trackingFrequency: string | null
    updatePreferences: string | null
    updatePreference: string | null
    communicationChannels: string | null
    updatedAt: Date | null
  }

  export type OperatingStyleCountAggregateOutputType = {
    id: number
    userId: number
    decisionStyle: number
    failureResponse: number
    obstacles: number
    otherObstacle: number
    guidancePreference: number
    trackingFrequency: number
    updatePreferences: number
    updatePreference: number
    communicationChannels: number
    updatedAt: number
    _all: number
  }


  export type OperatingStyleMinAggregateInputType = {
    id?: true
    userId?: true
    decisionStyle?: true
    failureResponse?: true
    obstacles?: true
    otherObstacle?: true
    guidancePreference?: true
    trackingFrequency?: true
    updatePreferences?: true
    updatePreference?: true
    communicationChannels?: true
    updatedAt?: true
  }

  export type OperatingStyleMaxAggregateInputType = {
    id?: true
    userId?: true
    decisionStyle?: true
    failureResponse?: true
    obstacles?: true
    otherObstacle?: true
    guidancePreference?: true
    trackingFrequency?: true
    updatePreferences?: true
    updatePreference?: true
    communicationChannels?: true
    updatedAt?: true
  }

  export type OperatingStyleCountAggregateInputType = {
    id?: true
    userId?: true
    decisionStyle?: true
    failureResponse?: true
    obstacles?: true
    otherObstacle?: true
    guidancePreference?: true
    trackingFrequency?: true
    updatePreferences?: true
    updatePreference?: true
    communicationChannels?: true
    updatedAt?: true
    _all?: true
  }

  export type OperatingStyleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OperatingStyle to aggregate.
     */
    where?: OperatingStyleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperatingStyles to fetch.
     */
    orderBy?: OperatingStyleOrderByWithRelationInput | OperatingStyleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OperatingStyleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperatingStyles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperatingStyles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OperatingStyles
    **/
    _count?: true | OperatingStyleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OperatingStyleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OperatingStyleMaxAggregateInputType
  }

  export type GetOperatingStyleAggregateType<T extends OperatingStyleAggregateArgs> = {
        [P in keyof T & keyof AggregateOperatingStyle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOperatingStyle[P]>
      : GetScalarType<T[P], AggregateOperatingStyle[P]>
  }




  export type OperatingStyleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OperatingStyleWhereInput
    orderBy?: OperatingStyleOrderByWithAggregationInput | OperatingStyleOrderByWithAggregationInput[]
    by: OperatingStyleScalarFieldEnum[] | OperatingStyleScalarFieldEnum
    having?: OperatingStyleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OperatingStyleCountAggregateInputType | true
    _min?: OperatingStyleMinAggregateInputType
    _max?: OperatingStyleMaxAggregateInputType
  }

  export type OperatingStyleGroupByOutputType = {
    id: string
    userId: string
    decisionStyle: string | null
    failureResponse: string | null
    obstacles: string | null
    otherObstacle: string | null
    guidancePreference: string | null
    trackingFrequency: string | null
    updatePreferences: string | null
    updatePreference: string | null
    communicationChannels: string | null
    updatedAt: Date
    _count: OperatingStyleCountAggregateOutputType | null
    _min: OperatingStyleMinAggregateOutputType | null
    _max: OperatingStyleMaxAggregateOutputType | null
  }

  type GetOperatingStyleGroupByPayload<T extends OperatingStyleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OperatingStyleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OperatingStyleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OperatingStyleGroupByOutputType[P]>
            : GetScalarType<T[P], OperatingStyleGroupByOutputType[P]>
        }
      >
    >


  export type OperatingStyleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    decisionStyle?: boolean
    failureResponse?: boolean
    obstacles?: boolean
    otherObstacle?: boolean
    guidancePreference?: boolean
    trackingFrequency?: boolean
    updatePreferences?: boolean
    updatePreference?: boolean
    communicationChannels?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operatingStyle"]>

  export type OperatingStyleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    decisionStyle?: boolean
    failureResponse?: boolean
    obstacles?: boolean
    otherObstacle?: boolean
    guidancePreference?: boolean
    trackingFrequency?: boolean
    updatePreferences?: boolean
    updatePreference?: boolean
    communicationChannels?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operatingStyle"]>

  export type OperatingStyleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    decisionStyle?: boolean
    failureResponse?: boolean
    obstacles?: boolean
    otherObstacle?: boolean
    guidancePreference?: boolean
    trackingFrequency?: boolean
    updatePreferences?: boolean
    updatePreference?: boolean
    communicationChannels?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operatingStyle"]>

  export type OperatingStyleSelectScalar = {
    id?: boolean
    userId?: boolean
    decisionStyle?: boolean
    failureResponse?: boolean
    obstacles?: boolean
    otherObstacle?: boolean
    guidancePreference?: boolean
    trackingFrequency?: boolean
    updatePreferences?: boolean
    updatePreference?: boolean
    communicationChannels?: boolean
    updatedAt?: boolean
  }

  export type OperatingStyleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "decisionStyle" | "failureResponse" | "obstacles" | "otherObstacle" | "guidancePreference" | "trackingFrequency" | "updatePreferences" | "updatePreference" | "communicationChannels" | "updatedAt", ExtArgs["result"]["operatingStyle"]>
  export type OperatingStyleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OperatingStyleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OperatingStyleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OperatingStylePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OperatingStyle"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      decisionStyle: string | null
      failureResponse: string | null
      obstacles: string | null
      otherObstacle: string | null
      guidancePreference: string | null
      trackingFrequency: string | null
      updatePreferences: string | null
      updatePreference: string | null
      communicationChannels: string | null
      updatedAt: Date
    }, ExtArgs["result"]["operatingStyle"]>
    composites: {}
  }

  type OperatingStyleGetPayload<S extends boolean | null | undefined | OperatingStyleDefaultArgs> = $Result.GetResult<Prisma.$OperatingStylePayload, S>

  type OperatingStyleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OperatingStyleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OperatingStyleCountAggregateInputType | true
    }

  export interface OperatingStyleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OperatingStyle'], meta: { name: 'OperatingStyle' } }
    /**
     * Find zero or one OperatingStyle that matches the filter.
     * @param {OperatingStyleFindUniqueArgs} args - Arguments to find a OperatingStyle
     * @example
     * // Get one OperatingStyle
     * const operatingStyle = await prisma.operatingStyle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OperatingStyleFindUniqueArgs>(args: SelectSubset<T, OperatingStyleFindUniqueArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one OperatingStyle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OperatingStyleFindUniqueOrThrowArgs} args - Arguments to find a OperatingStyle
     * @example
     * // Get one OperatingStyle
     * const operatingStyle = await prisma.operatingStyle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OperatingStyleFindUniqueOrThrowArgs>(args: SelectSubset<T, OperatingStyleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first OperatingStyle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatingStyleFindFirstArgs} args - Arguments to find a OperatingStyle
     * @example
     * // Get one OperatingStyle
     * const operatingStyle = await prisma.operatingStyle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OperatingStyleFindFirstArgs>(args?: SelectSubset<T, OperatingStyleFindFirstArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first OperatingStyle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatingStyleFindFirstOrThrowArgs} args - Arguments to find a OperatingStyle
     * @example
     * // Get one OperatingStyle
     * const operatingStyle = await prisma.operatingStyle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OperatingStyleFindFirstOrThrowArgs>(args?: SelectSubset<T, OperatingStyleFindFirstOrThrowArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more OperatingStyles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatingStyleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OperatingStyles
     * const operatingStyles = await prisma.operatingStyle.findMany()
     * 
     * // Get first 10 OperatingStyles
     * const operatingStyles = await prisma.operatingStyle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const operatingStyleWithIdOnly = await prisma.operatingStyle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OperatingStyleFindManyArgs>(args?: SelectSubset<T, OperatingStyleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a OperatingStyle.
     * @param {OperatingStyleCreateArgs} args - Arguments to create a OperatingStyle.
     * @example
     * // Create one OperatingStyle
     * const OperatingStyle = await prisma.operatingStyle.create({
     *   data: {
     *     // ... data to create a OperatingStyle
     *   }
     * })
     * 
     */
    create<T extends OperatingStyleCreateArgs>(args: SelectSubset<T, OperatingStyleCreateArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many OperatingStyles.
     * @param {OperatingStyleCreateManyArgs} args - Arguments to create many OperatingStyles.
     * @example
     * // Create many OperatingStyles
     * const operatingStyle = await prisma.operatingStyle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OperatingStyleCreateManyArgs>(args?: SelectSubset<T, OperatingStyleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OperatingStyles and returns the data saved in the database.
     * @param {OperatingStyleCreateManyAndReturnArgs} args - Arguments to create many OperatingStyles.
     * @example
     * // Create many OperatingStyles
     * const operatingStyle = await prisma.operatingStyle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OperatingStyles and only return the `id`
     * const operatingStyleWithIdOnly = await prisma.operatingStyle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OperatingStyleCreateManyAndReturnArgs>(args?: SelectSubset<T, OperatingStyleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a OperatingStyle.
     * @param {OperatingStyleDeleteArgs} args - Arguments to delete one OperatingStyle.
     * @example
     * // Delete one OperatingStyle
     * const OperatingStyle = await prisma.operatingStyle.delete({
     *   where: {
     *     // ... filter to delete one OperatingStyle
     *   }
     * })
     * 
     */
    delete<T extends OperatingStyleDeleteArgs>(args: SelectSubset<T, OperatingStyleDeleteArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one OperatingStyle.
     * @param {OperatingStyleUpdateArgs} args - Arguments to update one OperatingStyle.
     * @example
     * // Update one OperatingStyle
     * const operatingStyle = await prisma.operatingStyle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OperatingStyleUpdateArgs>(args: SelectSubset<T, OperatingStyleUpdateArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more OperatingStyles.
     * @param {OperatingStyleDeleteManyArgs} args - Arguments to filter OperatingStyles to delete.
     * @example
     * // Delete a few OperatingStyles
     * const { count } = await prisma.operatingStyle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OperatingStyleDeleteManyArgs>(args?: SelectSubset<T, OperatingStyleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OperatingStyles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatingStyleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OperatingStyles
     * const operatingStyle = await prisma.operatingStyle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OperatingStyleUpdateManyArgs>(args: SelectSubset<T, OperatingStyleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OperatingStyles and returns the data updated in the database.
     * @param {OperatingStyleUpdateManyAndReturnArgs} args - Arguments to update many OperatingStyles.
     * @example
     * // Update many OperatingStyles
     * const operatingStyle = await prisma.operatingStyle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OperatingStyles and only return the `id`
     * const operatingStyleWithIdOnly = await prisma.operatingStyle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OperatingStyleUpdateManyAndReturnArgs>(args: SelectSubset<T, OperatingStyleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one OperatingStyle.
     * @param {OperatingStyleUpsertArgs} args - Arguments to update or create a OperatingStyle.
     * @example
     * // Update or create a OperatingStyle
     * const operatingStyle = await prisma.operatingStyle.upsert({
     *   create: {
     *     // ... data to create a OperatingStyle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OperatingStyle we want to update
     *   }
     * })
     */
    upsert<T extends OperatingStyleUpsertArgs>(args: SelectSubset<T, OperatingStyleUpsertArgs<ExtArgs>>): Prisma__OperatingStyleClient<$Result.GetResult<Prisma.$OperatingStylePayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of OperatingStyles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatingStyleCountArgs} args - Arguments to filter OperatingStyles to count.
     * @example
     * // Count the number of OperatingStyles
     * const count = await prisma.operatingStyle.count({
     *   where: {
     *     // ... the filter for the OperatingStyles we want to count
     *   }
     * })
    **/
    count<T extends OperatingStyleCountArgs>(
      args?: Subset<T, OperatingStyleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OperatingStyleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OperatingStyle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatingStyleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OperatingStyleAggregateArgs>(args: Subset<T, OperatingStyleAggregateArgs>): Prisma.PrismaPromise<GetOperatingStyleAggregateType<T>>

    /**
     * Group by OperatingStyle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatingStyleGroupByArgs} args - Group by arguments.
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
      T extends OperatingStyleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OperatingStyleGroupByArgs['orderBy'] }
        : { orderBy?: OperatingStyleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OperatingStyleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOperatingStyleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OperatingStyle model
   */
  readonly fields: OperatingStyleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OperatingStyle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OperatingStyleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
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
   * Fields of the OperatingStyle model
   */ 
  interface OperatingStyleFieldRefs {
    readonly id: FieldRef<"OperatingStyle", 'String'>
    readonly userId: FieldRef<"OperatingStyle", 'String'>
    readonly decisionStyle: FieldRef<"OperatingStyle", 'String'>
    readonly failureResponse: FieldRef<"OperatingStyle", 'String'>
    readonly obstacles: FieldRef<"OperatingStyle", 'String'>
    readonly otherObstacle: FieldRef<"OperatingStyle", 'String'>
    readonly guidancePreference: FieldRef<"OperatingStyle", 'String'>
    readonly trackingFrequency: FieldRef<"OperatingStyle", 'String'>
    readonly updatePreferences: FieldRef<"OperatingStyle", 'String'>
    readonly updatePreference: FieldRef<"OperatingStyle", 'String'>
    readonly communicationChannels: FieldRef<"OperatingStyle", 'String'>
    readonly updatedAt: FieldRef<"OperatingStyle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OperatingStyle findUnique
   */
  export type OperatingStyleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * Filter, which OperatingStyle to fetch.
     */
    where: OperatingStyleWhereUniqueInput
  }

  /**
   * OperatingStyle findUniqueOrThrow
   */
  export type OperatingStyleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * Filter, which OperatingStyle to fetch.
     */
    where: OperatingStyleWhereUniqueInput
  }

  /**
   * OperatingStyle findFirst
   */
  export type OperatingStyleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * Filter, which OperatingStyle to fetch.
     */
    where?: OperatingStyleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperatingStyles to fetch.
     */
    orderBy?: OperatingStyleOrderByWithRelationInput | OperatingStyleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OperatingStyles.
     */
    cursor?: OperatingStyleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperatingStyles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperatingStyles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OperatingStyles.
     */
    distinct?: OperatingStyleScalarFieldEnum | OperatingStyleScalarFieldEnum[]
  }

  /**
   * OperatingStyle findFirstOrThrow
   */
  export type OperatingStyleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * Filter, which OperatingStyle to fetch.
     */
    where?: OperatingStyleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperatingStyles to fetch.
     */
    orderBy?: OperatingStyleOrderByWithRelationInput | OperatingStyleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OperatingStyles.
     */
    cursor?: OperatingStyleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperatingStyles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperatingStyles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OperatingStyles.
     */
    distinct?: OperatingStyleScalarFieldEnum | OperatingStyleScalarFieldEnum[]
  }

  /**
   * OperatingStyle findMany
   */
  export type OperatingStyleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * Filter, which OperatingStyles to fetch.
     */
    where?: OperatingStyleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OperatingStyles to fetch.
     */
    orderBy?: OperatingStyleOrderByWithRelationInput | OperatingStyleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OperatingStyles.
     */
    cursor?: OperatingStyleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OperatingStyles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OperatingStyles.
     */
    skip?: number
    distinct?: OperatingStyleScalarFieldEnum | OperatingStyleScalarFieldEnum[]
  }

  /**
   * OperatingStyle create
   */
  export type OperatingStyleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * The data needed to create a OperatingStyle.
     */
    data: XOR<OperatingStyleCreateInput, OperatingStyleUncheckedCreateInput>
  }

  /**
   * OperatingStyle createMany
   */
  export type OperatingStyleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OperatingStyles.
     */
    data: OperatingStyleCreateManyInput | OperatingStyleCreateManyInput[]
  }

  /**
   * OperatingStyle createManyAndReturn
   */
  export type OperatingStyleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * The data used to create many OperatingStyles.
     */
    data: OperatingStyleCreateManyInput | OperatingStyleCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OperatingStyle update
   */
  export type OperatingStyleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * The data needed to update a OperatingStyle.
     */
    data: XOR<OperatingStyleUpdateInput, OperatingStyleUncheckedUpdateInput>
    /**
     * Choose, which OperatingStyle to update.
     */
    where: OperatingStyleWhereUniqueInput
  }

  /**
   * OperatingStyle updateMany
   */
  export type OperatingStyleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OperatingStyles.
     */
    data: XOR<OperatingStyleUpdateManyMutationInput, OperatingStyleUncheckedUpdateManyInput>
    /**
     * Filter which OperatingStyles to update
     */
    where?: OperatingStyleWhereInput
    /**
     * Limit how many OperatingStyles to update.
     */
    limit?: number
  }

  /**
   * OperatingStyle updateManyAndReturn
   */
  export type OperatingStyleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * The data used to update OperatingStyles.
     */
    data: XOR<OperatingStyleUpdateManyMutationInput, OperatingStyleUncheckedUpdateManyInput>
    /**
     * Filter which OperatingStyles to update
     */
    where?: OperatingStyleWhereInput
    /**
     * Limit how many OperatingStyles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OperatingStyle upsert
   */
  export type OperatingStyleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * The filter to search for the OperatingStyle to update in case it exists.
     */
    where: OperatingStyleWhereUniqueInput
    /**
     * In case the OperatingStyle found by the `where` argument doesn't exist, create a new OperatingStyle with this data.
     */
    create: XOR<OperatingStyleCreateInput, OperatingStyleUncheckedCreateInput>
    /**
     * In case the OperatingStyle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OperatingStyleUpdateInput, OperatingStyleUncheckedUpdateInput>
  }

  /**
   * OperatingStyle delete
   */
  export type OperatingStyleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
    /**
     * Filter which OperatingStyle to delete.
     */
    where: OperatingStyleWhereUniqueInput
  }

  /**
   * OperatingStyle deleteMany
   */
  export type OperatingStyleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OperatingStyles to delete
     */
    where?: OperatingStyleWhereInput
    /**
     * Limit how many OperatingStyles to delete.
     */
    limit?: number
  }

  /**
   * OperatingStyle without action
   */
  export type OperatingStyleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatingStyle
     */
    select?: OperatingStyleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OperatingStyle
     */
    omit?: OperatingStyleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatingStyleInclude<ExtArgs> | null
  }


  /**
   * Model DigitalPlatform
   */

  export type AggregateDigitalPlatform = {
    _count: DigitalPlatformCountAggregateOutputType | null
    _min: DigitalPlatformMinAggregateOutputType | null
    _max: DigitalPlatformMaxAggregateOutputType | null
  }

  export type DigitalPlatformMinAggregateOutputType = {
    id: string | null
    userId: string | null
    supportReasons: string | null
    otherSupportReason: string | null
    remoteConfidence: string | null
    remoteComfort: string | null
    recordKeeping: string | null
    physicalAudits: string | null
    additionalNotes: string | null
    updatedAt: Date | null
  }

  export type DigitalPlatformMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    supportReasons: string | null
    otherSupportReason: string | null
    remoteConfidence: string | null
    remoteComfort: string | null
    recordKeeping: string | null
    physicalAudits: string | null
    additionalNotes: string | null
    updatedAt: Date | null
  }

  export type DigitalPlatformCountAggregateOutputType = {
    id: number
    userId: number
    supportReasons: number
    otherSupportReason: number
    remoteConfidence: number
    remoteComfort: number
    recordKeeping: number
    physicalAudits: number
    additionalNotes: number
    updatedAt: number
    _all: number
  }


  export type DigitalPlatformMinAggregateInputType = {
    id?: true
    userId?: true
    supportReasons?: true
    otherSupportReason?: true
    remoteConfidence?: true
    remoteComfort?: true
    recordKeeping?: true
    physicalAudits?: true
    additionalNotes?: true
    updatedAt?: true
  }

  export type DigitalPlatformMaxAggregateInputType = {
    id?: true
    userId?: true
    supportReasons?: true
    otherSupportReason?: true
    remoteConfidence?: true
    remoteComfort?: true
    recordKeeping?: true
    physicalAudits?: true
    additionalNotes?: true
    updatedAt?: true
  }

  export type DigitalPlatformCountAggregateInputType = {
    id?: true
    userId?: true
    supportReasons?: true
    otherSupportReason?: true
    remoteConfidence?: true
    remoteComfort?: true
    recordKeeping?: true
    physicalAudits?: true
    additionalNotes?: true
    updatedAt?: true
    _all?: true
  }

  export type DigitalPlatformAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DigitalPlatform to aggregate.
     */
    where?: DigitalPlatformWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DigitalPlatforms to fetch.
     */
    orderBy?: DigitalPlatformOrderByWithRelationInput | DigitalPlatformOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DigitalPlatformWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DigitalPlatforms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DigitalPlatforms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DigitalPlatforms
    **/
    _count?: true | DigitalPlatformCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DigitalPlatformMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DigitalPlatformMaxAggregateInputType
  }

  export type GetDigitalPlatformAggregateType<T extends DigitalPlatformAggregateArgs> = {
        [P in keyof T & keyof AggregateDigitalPlatform]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDigitalPlatform[P]>
      : GetScalarType<T[P], AggregateDigitalPlatform[P]>
  }




  export type DigitalPlatformGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DigitalPlatformWhereInput
    orderBy?: DigitalPlatformOrderByWithAggregationInput | DigitalPlatformOrderByWithAggregationInput[]
    by: DigitalPlatformScalarFieldEnum[] | DigitalPlatformScalarFieldEnum
    having?: DigitalPlatformScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DigitalPlatformCountAggregateInputType | true
    _min?: DigitalPlatformMinAggregateInputType
    _max?: DigitalPlatformMaxAggregateInputType
  }

  export type DigitalPlatformGroupByOutputType = {
    id: string
    userId: string
    supportReasons: string | null
    otherSupportReason: string | null
    remoteConfidence: string | null
    remoteComfort: string | null
    recordKeeping: string | null
    physicalAudits: string | null
    additionalNotes: string | null
    updatedAt: Date
    _count: DigitalPlatformCountAggregateOutputType | null
    _min: DigitalPlatformMinAggregateOutputType | null
    _max: DigitalPlatformMaxAggregateOutputType | null
  }

  type GetDigitalPlatformGroupByPayload<T extends DigitalPlatformGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DigitalPlatformGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DigitalPlatformGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DigitalPlatformGroupByOutputType[P]>
            : GetScalarType<T[P], DigitalPlatformGroupByOutputType[P]>
        }
      >
    >


  export type DigitalPlatformSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    supportReasons?: boolean
    otherSupportReason?: boolean
    remoteConfidence?: boolean
    remoteComfort?: boolean
    recordKeeping?: boolean
    physicalAudits?: boolean
    additionalNotes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["digitalPlatform"]>

  export type DigitalPlatformSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    supportReasons?: boolean
    otherSupportReason?: boolean
    remoteConfidence?: boolean
    remoteComfort?: boolean
    recordKeeping?: boolean
    physicalAudits?: boolean
    additionalNotes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["digitalPlatform"]>

  export type DigitalPlatformSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    supportReasons?: boolean
    otherSupportReason?: boolean
    remoteConfidence?: boolean
    remoteComfort?: boolean
    recordKeeping?: boolean
    physicalAudits?: boolean
    additionalNotes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["digitalPlatform"]>

  export type DigitalPlatformSelectScalar = {
    id?: boolean
    userId?: boolean
    supportReasons?: boolean
    otherSupportReason?: boolean
    remoteConfidence?: boolean
    remoteComfort?: boolean
    recordKeeping?: boolean
    physicalAudits?: boolean
    additionalNotes?: boolean
    updatedAt?: boolean
  }

  export type DigitalPlatformOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "supportReasons" | "otherSupportReason" | "remoteConfidence" | "remoteComfort" | "recordKeeping" | "physicalAudits" | "additionalNotes" | "updatedAt", ExtArgs["result"]["digitalPlatform"]>
  export type DigitalPlatformInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DigitalPlatformIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DigitalPlatformIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DigitalPlatformPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DigitalPlatform"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      supportReasons: string | null
      otherSupportReason: string | null
      remoteConfidence: string | null
      remoteComfort: string | null
      recordKeeping: string | null
      physicalAudits: string | null
      additionalNotes: string | null
      updatedAt: Date
    }, ExtArgs["result"]["digitalPlatform"]>
    composites: {}
  }

  type DigitalPlatformGetPayload<S extends boolean | null | undefined | DigitalPlatformDefaultArgs> = $Result.GetResult<Prisma.$DigitalPlatformPayload, S>

  type DigitalPlatformCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DigitalPlatformFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DigitalPlatformCountAggregateInputType | true
    }

  export interface DigitalPlatformDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DigitalPlatform'], meta: { name: 'DigitalPlatform' } }
    /**
     * Find zero or one DigitalPlatform that matches the filter.
     * @param {DigitalPlatformFindUniqueArgs} args - Arguments to find a DigitalPlatform
     * @example
     * // Get one DigitalPlatform
     * const digitalPlatform = await prisma.digitalPlatform.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DigitalPlatformFindUniqueArgs>(args: SelectSubset<T, DigitalPlatformFindUniqueArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one DigitalPlatform that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DigitalPlatformFindUniqueOrThrowArgs} args - Arguments to find a DigitalPlatform
     * @example
     * // Get one DigitalPlatform
     * const digitalPlatform = await prisma.digitalPlatform.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DigitalPlatformFindUniqueOrThrowArgs>(args: SelectSubset<T, DigitalPlatformFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first DigitalPlatform that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalPlatformFindFirstArgs} args - Arguments to find a DigitalPlatform
     * @example
     * // Get one DigitalPlatform
     * const digitalPlatform = await prisma.digitalPlatform.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DigitalPlatformFindFirstArgs>(args?: SelectSubset<T, DigitalPlatformFindFirstArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first DigitalPlatform that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalPlatformFindFirstOrThrowArgs} args - Arguments to find a DigitalPlatform
     * @example
     * // Get one DigitalPlatform
     * const digitalPlatform = await prisma.digitalPlatform.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DigitalPlatformFindFirstOrThrowArgs>(args?: SelectSubset<T, DigitalPlatformFindFirstOrThrowArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more DigitalPlatforms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalPlatformFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DigitalPlatforms
     * const digitalPlatforms = await prisma.digitalPlatform.findMany()
     * 
     * // Get first 10 DigitalPlatforms
     * const digitalPlatforms = await prisma.digitalPlatform.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const digitalPlatformWithIdOnly = await prisma.digitalPlatform.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DigitalPlatformFindManyArgs>(args?: SelectSubset<T, DigitalPlatformFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a DigitalPlatform.
     * @param {DigitalPlatformCreateArgs} args - Arguments to create a DigitalPlatform.
     * @example
     * // Create one DigitalPlatform
     * const DigitalPlatform = await prisma.digitalPlatform.create({
     *   data: {
     *     // ... data to create a DigitalPlatform
     *   }
     * })
     * 
     */
    create<T extends DigitalPlatformCreateArgs>(args: SelectSubset<T, DigitalPlatformCreateArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many DigitalPlatforms.
     * @param {DigitalPlatformCreateManyArgs} args - Arguments to create many DigitalPlatforms.
     * @example
     * // Create many DigitalPlatforms
     * const digitalPlatform = await prisma.digitalPlatform.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DigitalPlatformCreateManyArgs>(args?: SelectSubset<T, DigitalPlatformCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DigitalPlatforms and returns the data saved in the database.
     * @param {DigitalPlatformCreateManyAndReturnArgs} args - Arguments to create many DigitalPlatforms.
     * @example
     * // Create many DigitalPlatforms
     * const digitalPlatform = await prisma.digitalPlatform.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DigitalPlatforms and only return the `id`
     * const digitalPlatformWithIdOnly = await prisma.digitalPlatform.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DigitalPlatformCreateManyAndReturnArgs>(args?: SelectSubset<T, DigitalPlatformCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a DigitalPlatform.
     * @param {DigitalPlatformDeleteArgs} args - Arguments to delete one DigitalPlatform.
     * @example
     * // Delete one DigitalPlatform
     * const DigitalPlatform = await prisma.digitalPlatform.delete({
     *   where: {
     *     // ... filter to delete one DigitalPlatform
     *   }
     * })
     * 
     */
    delete<T extends DigitalPlatformDeleteArgs>(args: SelectSubset<T, DigitalPlatformDeleteArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one DigitalPlatform.
     * @param {DigitalPlatformUpdateArgs} args - Arguments to update one DigitalPlatform.
     * @example
     * // Update one DigitalPlatform
     * const digitalPlatform = await prisma.digitalPlatform.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DigitalPlatformUpdateArgs>(args: SelectSubset<T, DigitalPlatformUpdateArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more DigitalPlatforms.
     * @param {DigitalPlatformDeleteManyArgs} args - Arguments to filter DigitalPlatforms to delete.
     * @example
     * // Delete a few DigitalPlatforms
     * const { count } = await prisma.digitalPlatform.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DigitalPlatformDeleteManyArgs>(args?: SelectSubset<T, DigitalPlatformDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DigitalPlatforms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalPlatformUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DigitalPlatforms
     * const digitalPlatform = await prisma.digitalPlatform.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DigitalPlatformUpdateManyArgs>(args: SelectSubset<T, DigitalPlatformUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DigitalPlatforms and returns the data updated in the database.
     * @param {DigitalPlatformUpdateManyAndReturnArgs} args - Arguments to update many DigitalPlatforms.
     * @example
     * // Update many DigitalPlatforms
     * const digitalPlatform = await prisma.digitalPlatform.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DigitalPlatforms and only return the `id`
     * const digitalPlatformWithIdOnly = await prisma.digitalPlatform.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DigitalPlatformUpdateManyAndReturnArgs>(args: SelectSubset<T, DigitalPlatformUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one DigitalPlatform.
     * @param {DigitalPlatformUpsertArgs} args - Arguments to update or create a DigitalPlatform.
     * @example
     * // Update or create a DigitalPlatform
     * const digitalPlatform = await prisma.digitalPlatform.upsert({
     *   create: {
     *     // ... data to create a DigitalPlatform
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DigitalPlatform we want to update
     *   }
     * })
     */
    upsert<T extends DigitalPlatformUpsertArgs>(args: SelectSubset<T, DigitalPlatformUpsertArgs<ExtArgs>>): Prisma__DigitalPlatformClient<$Result.GetResult<Prisma.$DigitalPlatformPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of DigitalPlatforms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalPlatformCountArgs} args - Arguments to filter DigitalPlatforms to count.
     * @example
     * // Count the number of DigitalPlatforms
     * const count = await prisma.digitalPlatform.count({
     *   where: {
     *     // ... the filter for the DigitalPlatforms we want to count
     *   }
     * })
    **/
    count<T extends DigitalPlatformCountArgs>(
      args?: Subset<T, DigitalPlatformCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DigitalPlatformCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DigitalPlatform.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalPlatformAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DigitalPlatformAggregateArgs>(args: Subset<T, DigitalPlatformAggregateArgs>): Prisma.PrismaPromise<GetDigitalPlatformAggregateType<T>>

    /**
     * Group by DigitalPlatform.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DigitalPlatformGroupByArgs} args - Group by arguments.
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
      T extends DigitalPlatformGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DigitalPlatformGroupByArgs['orderBy'] }
        : { orderBy?: DigitalPlatformGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DigitalPlatformGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDigitalPlatformGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DigitalPlatform model
   */
  readonly fields: DigitalPlatformFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DigitalPlatform.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DigitalPlatformClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
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
   * Fields of the DigitalPlatform model
   */ 
  interface DigitalPlatformFieldRefs {
    readonly id: FieldRef<"DigitalPlatform", 'String'>
    readonly userId: FieldRef<"DigitalPlatform", 'String'>
    readonly supportReasons: FieldRef<"DigitalPlatform", 'String'>
    readonly otherSupportReason: FieldRef<"DigitalPlatform", 'String'>
    readonly remoteConfidence: FieldRef<"DigitalPlatform", 'String'>
    readonly remoteComfort: FieldRef<"DigitalPlatform", 'String'>
    readonly recordKeeping: FieldRef<"DigitalPlatform", 'String'>
    readonly physicalAudits: FieldRef<"DigitalPlatform", 'String'>
    readonly additionalNotes: FieldRef<"DigitalPlatform", 'String'>
    readonly updatedAt: FieldRef<"DigitalPlatform", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DigitalPlatform findUnique
   */
  export type DigitalPlatformFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * Filter, which DigitalPlatform to fetch.
     */
    where: DigitalPlatformWhereUniqueInput
  }

  /**
   * DigitalPlatform findUniqueOrThrow
   */
  export type DigitalPlatformFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * Filter, which DigitalPlatform to fetch.
     */
    where: DigitalPlatformWhereUniqueInput
  }

  /**
   * DigitalPlatform findFirst
   */
  export type DigitalPlatformFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * Filter, which DigitalPlatform to fetch.
     */
    where?: DigitalPlatformWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DigitalPlatforms to fetch.
     */
    orderBy?: DigitalPlatformOrderByWithRelationInput | DigitalPlatformOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DigitalPlatforms.
     */
    cursor?: DigitalPlatformWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DigitalPlatforms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DigitalPlatforms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DigitalPlatforms.
     */
    distinct?: DigitalPlatformScalarFieldEnum | DigitalPlatformScalarFieldEnum[]
  }

  /**
   * DigitalPlatform findFirstOrThrow
   */
  export type DigitalPlatformFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * Filter, which DigitalPlatform to fetch.
     */
    where?: DigitalPlatformWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DigitalPlatforms to fetch.
     */
    orderBy?: DigitalPlatformOrderByWithRelationInput | DigitalPlatformOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DigitalPlatforms.
     */
    cursor?: DigitalPlatformWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DigitalPlatforms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DigitalPlatforms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DigitalPlatforms.
     */
    distinct?: DigitalPlatformScalarFieldEnum | DigitalPlatformScalarFieldEnum[]
  }

  /**
   * DigitalPlatform findMany
   */
  export type DigitalPlatformFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * Filter, which DigitalPlatforms to fetch.
     */
    where?: DigitalPlatformWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DigitalPlatforms to fetch.
     */
    orderBy?: DigitalPlatformOrderByWithRelationInput | DigitalPlatformOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DigitalPlatforms.
     */
    cursor?: DigitalPlatformWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DigitalPlatforms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DigitalPlatforms.
     */
    skip?: number
    distinct?: DigitalPlatformScalarFieldEnum | DigitalPlatformScalarFieldEnum[]
  }

  /**
   * DigitalPlatform create
   */
  export type DigitalPlatformCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * The data needed to create a DigitalPlatform.
     */
    data: XOR<DigitalPlatformCreateInput, DigitalPlatformUncheckedCreateInput>
  }

  /**
   * DigitalPlatform createMany
   */
  export type DigitalPlatformCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DigitalPlatforms.
     */
    data: DigitalPlatformCreateManyInput | DigitalPlatformCreateManyInput[]
  }

  /**
   * DigitalPlatform createManyAndReturn
   */
  export type DigitalPlatformCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * The data used to create many DigitalPlatforms.
     */
    data: DigitalPlatformCreateManyInput | DigitalPlatformCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DigitalPlatform update
   */
  export type DigitalPlatformUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * The data needed to update a DigitalPlatform.
     */
    data: XOR<DigitalPlatformUpdateInput, DigitalPlatformUncheckedUpdateInput>
    /**
     * Choose, which DigitalPlatform to update.
     */
    where: DigitalPlatformWhereUniqueInput
  }

  /**
   * DigitalPlatform updateMany
   */
  export type DigitalPlatformUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DigitalPlatforms.
     */
    data: XOR<DigitalPlatformUpdateManyMutationInput, DigitalPlatformUncheckedUpdateManyInput>
    /**
     * Filter which DigitalPlatforms to update
     */
    where?: DigitalPlatformWhereInput
    /**
     * Limit how many DigitalPlatforms to update.
     */
    limit?: number
  }

  /**
   * DigitalPlatform updateManyAndReturn
   */
  export type DigitalPlatformUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * The data used to update DigitalPlatforms.
     */
    data: XOR<DigitalPlatformUpdateManyMutationInput, DigitalPlatformUncheckedUpdateManyInput>
    /**
     * Filter which DigitalPlatforms to update
     */
    where?: DigitalPlatformWhereInput
    /**
     * Limit how many DigitalPlatforms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DigitalPlatform upsert
   */
  export type DigitalPlatformUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * The filter to search for the DigitalPlatform to update in case it exists.
     */
    where: DigitalPlatformWhereUniqueInput
    /**
     * In case the DigitalPlatform found by the `where` argument doesn't exist, create a new DigitalPlatform with this data.
     */
    create: XOR<DigitalPlatformCreateInput, DigitalPlatformUncheckedCreateInput>
    /**
     * In case the DigitalPlatform was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DigitalPlatformUpdateInput, DigitalPlatformUncheckedUpdateInput>
  }

  /**
   * DigitalPlatform delete
   */
  export type DigitalPlatformDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
    /**
     * Filter which DigitalPlatform to delete.
     */
    where: DigitalPlatformWhereUniqueInput
  }

  /**
   * DigitalPlatform deleteMany
   */
  export type DigitalPlatformDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DigitalPlatforms to delete
     */
    where?: DigitalPlatformWhereInput
    /**
     * Limit how many DigitalPlatforms to delete.
     */
    limit?: number
  }

  /**
   * DigitalPlatform without action
   */
  export type DigitalPlatformDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DigitalPlatform
     */
    select?: DigitalPlatformSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DigitalPlatform
     */
    omit?: DigitalPlatformOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DigitalPlatformInclude<ExtArgs> | null
  }


  /**
   * Model Aspiration
   */

  export type AggregateAspiration = {
    _count: AspirationCountAggregateOutputType | null
    _min: AspirationMinAggregateOutputType | null
    _max: AspirationMaxAggregateOutputType | null
  }

  export type AspirationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    twelveMonthSuccess: string | null
    greatestImpactSupport: string | null
    marketInsight: string | null
    threeToFiveYearRole: string | null
    managerResponsibilities: string | null
    fmResponsibility: string | null
    handoverResponsibilities: string | null
    personallyApprovedDecisions: string | null
    twentyFiveYearVision: string | null
    updatedAt: Date | null
  }

  export type AspirationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    twelveMonthSuccess: string | null
    greatestImpactSupport: string | null
    marketInsight: string | null
    threeToFiveYearRole: string | null
    managerResponsibilities: string | null
    fmResponsibility: string | null
    handoverResponsibilities: string | null
    personallyApprovedDecisions: string | null
    twentyFiveYearVision: string | null
    updatedAt: Date | null
  }

  export type AspirationCountAggregateOutputType = {
    id: number
    userId: number
    twelveMonthSuccess: number
    greatestImpactSupport: number
    marketInsight: number
    threeToFiveYearRole: number
    managerResponsibilities: number
    fmResponsibility: number
    handoverResponsibilities: number
    personallyApprovedDecisions: number
    twentyFiveYearVision: number
    updatedAt: number
    _all: number
  }


  export type AspirationMinAggregateInputType = {
    id?: true
    userId?: true
    twelveMonthSuccess?: true
    greatestImpactSupport?: true
    marketInsight?: true
    threeToFiveYearRole?: true
    managerResponsibilities?: true
    fmResponsibility?: true
    handoverResponsibilities?: true
    personallyApprovedDecisions?: true
    twentyFiveYearVision?: true
    updatedAt?: true
  }

  export type AspirationMaxAggregateInputType = {
    id?: true
    userId?: true
    twelveMonthSuccess?: true
    greatestImpactSupport?: true
    marketInsight?: true
    threeToFiveYearRole?: true
    managerResponsibilities?: true
    fmResponsibility?: true
    handoverResponsibilities?: true
    personallyApprovedDecisions?: true
    twentyFiveYearVision?: true
    updatedAt?: true
  }

  export type AspirationCountAggregateInputType = {
    id?: true
    userId?: true
    twelveMonthSuccess?: true
    greatestImpactSupport?: true
    marketInsight?: true
    threeToFiveYearRole?: true
    managerResponsibilities?: true
    fmResponsibility?: true
    handoverResponsibilities?: true
    personallyApprovedDecisions?: true
    twentyFiveYearVision?: true
    updatedAt?: true
    _all?: true
  }

  export type AspirationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Aspiration to aggregate.
     */
    where?: AspirationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Aspirations to fetch.
     */
    orderBy?: AspirationOrderByWithRelationInput | AspirationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AspirationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Aspirations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Aspirations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Aspirations
    **/
    _count?: true | AspirationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AspirationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AspirationMaxAggregateInputType
  }

  export type GetAspirationAggregateType<T extends AspirationAggregateArgs> = {
        [P in keyof T & keyof AggregateAspiration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAspiration[P]>
      : GetScalarType<T[P], AggregateAspiration[P]>
  }




  export type AspirationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AspirationWhereInput
    orderBy?: AspirationOrderByWithAggregationInput | AspirationOrderByWithAggregationInput[]
    by: AspirationScalarFieldEnum[] | AspirationScalarFieldEnum
    having?: AspirationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AspirationCountAggregateInputType | true
    _min?: AspirationMinAggregateInputType
    _max?: AspirationMaxAggregateInputType
  }

  export type AspirationGroupByOutputType = {
    id: string
    userId: string
    twelveMonthSuccess: string | null
    greatestImpactSupport: string | null
    marketInsight: string | null
    threeToFiveYearRole: string | null
    managerResponsibilities: string | null
    fmResponsibility: string | null
    handoverResponsibilities: string | null
    personallyApprovedDecisions: string | null
    twentyFiveYearVision: string | null
    updatedAt: Date
    _count: AspirationCountAggregateOutputType | null
    _min: AspirationMinAggregateOutputType | null
    _max: AspirationMaxAggregateOutputType | null
  }

  type GetAspirationGroupByPayload<T extends AspirationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AspirationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AspirationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AspirationGroupByOutputType[P]>
            : GetScalarType<T[P], AspirationGroupByOutputType[P]>
        }
      >
    >


  export type AspirationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    twelveMonthSuccess?: boolean
    greatestImpactSupport?: boolean
    marketInsight?: boolean
    threeToFiveYearRole?: boolean
    managerResponsibilities?: boolean
    fmResponsibility?: boolean
    handoverResponsibilities?: boolean
    personallyApprovedDecisions?: boolean
    twentyFiveYearVision?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aspiration"]>

  export type AspirationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    twelveMonthSuccess?: boolean
    greatestImpactSupport?: boolean
    marketInsight?: boolean
    threeToFiveYearRole?: boolean
    managerResponsibilities?: boolean
    fmResponsibility?: boolean
    handoverResponsibilities?: boolean
    personallyApprovedDecisions?: boolean
    twentyFiveYearVision?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aspiration"]>

  export type AspirationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    twelveMonthSuccess?: boolean
    greatestImpactSupport?: boolean
    marketInsight?: boolean
    threeToFiveYearRole?: boolean
    managerResponsibilities?: boolean
    fmResponsibility?: boolean
    handoverResponsibilities?: boolean
    personallyApprovedDecisions?: boolean
    twentyFiveYearVision?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aspiration"]>

  export type AspirationSelectScalar = {
    id?: boolean
    userId?: boolean
    twelveMonthSuccess?: boolean
    greatestImpactSupport?: boolean
    marketInsight?: boolean
    threeToFiveYearRole?: boolean
    managerResponsibilities?: boolean
    fmResponsibility?: boolean
    handoverResponsibilities?: boolean
    personallyApprovedDecisions?: boolean
    twentyFiveYearVision?: boolean
    updatedAt?: boolean
  }

  export type AspirationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "twelveMonthSuccess" | "greatestImpactSupport" | "marketInsight" | "threeToFiveYearRole" | "managerResponsibilities" | "fmResponsibility" | "handoverResponsibilities" | "personallyApprovedDecisions" | "twentyFiveYearVision" | "updatedAt", ExtArgs["result"]["aspiration"]>
  export type AspirationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AspirationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AspirationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AspirationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Aspiration"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      twelveMonthSuccess: string | null
      greatestImpactSupport: string | null
      marketInsight: string | null
      threeToFiveYearRole: string | null
      managerResponsibilities: string | null
      fmResponsibility: string | null
      handoverResponsibilities: string | null
      personallyApprovedDecisions: string | null
      twentyFiveYearVision: string | null
      updatedAt: Date
    }, ExtArgs["result"]["aspiration"]>
    composites: {}
  }

  type AspirationGetPayload<S extends boolean | null | undefined | AspirationDefaultArgs> = $Result.GetResult<Prisma.$AspirationPayload, S>

  type AspirationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AspirationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AspirationCountAggregateInputType | true
    }

  export interface AspirationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Aspiration'], meta: { name: 'Aspiration' } }
    /**
     * Find zero or one Aspiration that matches the filter.
     * @param {AspirationFindUniqueArgs} args - Arguments to find a Aspiration
     * @example
     * // Get one Aspiration
     * const aspiration = await prisma.aspiration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AspirationFindUniqueArgs>(args: SelectSubset<T, AspirationFindUniqueArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one Aspiration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AspirationFindUniqueOrThrowArgs} args - Arguments to find a Aspiration
     * @example
     * // Get one Aspiration
     * const aspiration = await prisma.aspiration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AspirationFindUniqueOrThrowArgs>(args: SelectSubset<T, AspirationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first Aspiration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AspirationFindFirstArgs} args - Arguments to find a Aspiration
     * @example
     * // Get one Aspiration
     * const aspiration = await prisma.aspiration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AspirationFindFirstArgs>(args?: SelectSubset<T, AspirationFindFirstArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first Aspiration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AspirationFindFirstOrThrowArgs} args - Arguments to find a Aspiration
     * @example
     * // Get one Aspiration
     * const aspiration = await prisma.aspiration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AspirationFindFirstOrThrowArgs>(args?: SelectSubset<T, AspirationFindFirstOrThrowArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more Aspirations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AspirationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Aspirations
     * const aspirations = await prisma.aspiration.findMany()
     * 
     * // Get first 10 Aspirations
     * const aspirations = await prisma.aspiration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aspirationWithIdOnly = await prisma.aspiration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AspirationFindManyArgs>(args?: SelectSubset<T, AspirationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a Aspiration.
     * @param {AspirationCreateArgs} args - Arguments to create a Aspiration.
     * @example
     * // Create one Aspiration
     * const Aspiration = await prisma.aspiration.create({
     *   data: {
     *     // ... data to create a Aspiration
     *   }
     * })
     * 
     */
    create<T extends AspirationCreateArgs>(args: SelectSubset<T, AspirationCreateArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many Aspirations.
     * @param {AspirationCreateManyArgs} args - Arguments to create many Aspirations.
     * @example
     * // Create many Aspirations
     * const aspiration = await prisma.aspiration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AspirationCreateManyArgs>(args?: SelectSubset<T, AspirationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Aspirations and returns the data saved in the database.
     * @param {AspirationCreateManyAndReturnArgs} args - Arguments to create many Aspirations.
     * @example
     * // Create many Aspirations
     * const aspiration = await prisma.aspiration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Aspirations and only return the `id`
     * const aspirationWithIdOnly = await prisma.aspiration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AspirationCreateManyAndReturnArgs>(args?: SelectSubset<T, AspirationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a Aspiration.
     * @param {AspirationDeleteArgs} args - Arguments to delete one Aspiration.
     * @example
     * // Delete one Aspiration
     * const Aspiration = await prisma.aspiration.delete({
     *   where: {
     *     // ... filter to delete one Aspiration
     *   }
     * })
     * 
     */
    delete<T extends AspirationDeleteArgs>(args: SelectSubset<T, AspirationDeleteArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one Aspiration.
     * @param {AspirationUpdateArgs} args - Arguments to update one Aspiration.
     * @example
     * // Update one Aspiration
     * const aspiration = await prisma.aspiration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AspirationUpdateArgs>(args: SelectSubset<T, AspirationUpdateArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more Aspirations.
     * @param {AspirationDeleteManyArgs} args - Arguments to filter Aspirations to delete.
     * @example
     * // Delete a few Aspirations
     * const { count } = await prisma.aspiration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AspirationDeleteManyArgs>(args?: SelectSubset<T, AspirationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Aspirations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AspirationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Aspirations
     * const aspiration = await prisma.aspiration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AspirationUpdateManyArgs>(args: SelectSubset<T, AspirationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Aspirations and returns the data updated in the database.
     * @param {AspirationUpdateManyAndReturnArgs} args - Arguments to update many Aspirations.
     * @example
     * // Update many Aspirations
     * const aspiration = await prisma.aspiration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Aspirations and only return the `id`
     * const aspirationWithIdOnly = await prisma.aspiration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AspirationUpdateManyAndReturnArgs>(args: SelectSubset<T, AspirationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one Aspiration.
     * @param {AspirationUpsertArgs} args - Arguments to update or create a Aspiration.
     * @example
     * // Update or create a Aspiration
     * const aspiration = await prisma.aspiration.upsert({
     *   create: {
     *     // ... data to create a Aspiration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Aspiration we want to update
     *   }
     * })
     */
    upsert<T extends AspirationUpsertArgs>(args: SelectSubset<T, AspirationUpsertArgs<ExtArgs>>): Prisma__AspirationClient<$Result.GetResult<Prisma.$AspirationPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of Aspirations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AspirationCountArgs} args - Arguments to filter Aspirations to count.
     * @example
     * // Count the number of Aspirations
     * const count = await prisma.aspiration.count({
     *   where: {
     *     // ... the filter for the Aspirations we want to count
     *   }
     * })
    **/
    count<T extends AspirationCountArgs>(
      args?: Subset<T, AspirationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AspirationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Aspiration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AspirationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AspirationAggregateArgs>(args: Subset<T, AspirationAggregateArgs>): Prisma.PrismaPromise<GetAspirationAggregateType<T>>

    /**
     * Group by Aspiration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AspirationGroupByArgs} args - Group by arguments.
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
      T extends AspirationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AspirationGroupByArgs['orderBy'] }
        : { orderBy?: AspirationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AspirationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAspirationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Aspiration model
   */
  readonly fields: AspirationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Aspiration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AspirationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
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
   * Fields of the Aspiration model
   */ 
  interface AspirationFieldRefs {
    readonly id: FieldRef<"Aspiration", 'String'>
    readonly userId: FieldRef<"Aspiration", 'String'>
    readonly twelveMonthSuccess: FieldRef<"Aspiration", 'String'>
    readonly greatestImpactSupport: FieldRef<"Aspiration", 'String'>
    readonly marketInsight: FieldRef<"Aspiration", 'String'>
    readonly threeToFiveYearRole: FieldRef<"Aspiration", 'String'>
    readonly managerResponsibilities: FieldRef<"Aspiration", 'String'>
    readonly fmResponsibility: FieldRef<"Aspiration", 'String'>
    readonly handoverResponsibilities: FieldRef<"Aspiration", 'String'>
    readonly personallyApprovedDecisions: FieldRef<"Aspiration", 'String'>
    readonly twentyFiveYearVision: FieldRef<"Aspiration", 'String'>
    readonly updatedAt: FieldRef<"Aspiration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Aspiration findUnique
   */
  export type AspirationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * Filter, which Aspiration to fetch.
     */
    where: AspirationWhereUniqueInput
  }

  /**
   * Aspiration findUniqueOrThrow
   */
  export type AspirationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * Filter, which Aspiration to fetch.
     */
    where: AspirationWhereUniqueInput
  }

  /**
   * Aspiration findFirst
   */
  export type AspirationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * Filter, which Aspiration to fetch.
     */
    where?: AspirationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Aspirations to fetch.
     */
    orderBy?: AspirationOrderByWithRelationInput | AspirationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Aspirations.
     */
    cursor?: AspirationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Aspirations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Aspirations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Aspirations.
     */
    distinct?: AspirationScalarFieldEnum | AspirationScalarFieldEnum[]
  }

  /**
   * Aspiration findFirstOrThrow
   */
  export type AspirationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * Filter, which Aspiration to fetch.
     */
    where?: AspirationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Aspirations to fetch.
     */
    orderBy?: AspirationOrderByWithRelationInput | AspirationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Aspirations.
     */
    cursor?: AspirationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Aspirations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Aspirations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Aspirations.
     */
    distinct?: AspirationScalarFieldEnum | AspirationScalarFieldEnum[]
  }

  /**
   * Aspiration findMany
   */
  export type AspirationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * Filter, which Aspirations to fetch.
     */
    where?: AspirationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Aspirations to fetch.
     */
    orderBy?: AspirationOrderByWithRelationInput | AspirationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Aspirations.
     */
    cursor?: AspirationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Aspirations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Aspirations.
     */
    skip?: number
    distinct?: AspirationScalarFieldEnum | AspirationScalarFieldEnum[]
  }

  /**
   * Aspiration create
   */
  export type AspirationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * The data needed to create a Aspiration.
     */
    data: XOR<AspirationCreateInput, AspirationUncheckedCreateInput>
  }

  /**
   * Aspiration createMany
   */
  export type AspirationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Aspirations.
     */
    data: AspirationCreateManyInput | AspirationCreateManyInput[]
  }

  /**
   * Aspiration createManyAndReturn
   */
  export type AspirationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * The data used to create many Aspirations.
     */
    data: AspirationCreateManyInput | AspirationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Aspiration update
   */
  export type AspirationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * The data needed to update a Aspiration.
     */
    data: XOR<AspirationUpdateInput, AspirationUncheckedUpdateInput>
    /**
     * Choose, which Aspiration to update.
     */
    where: AspirationWhereUniqueInput
  }

  /**
   * Aspiration updateMany
   */
  export type AspirationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Aspirations.
     */
    data: XOR<AspirationUpdateManyMutationInput, AspirationUncheckedUpdateManyInput>
    /**
     * Filter which Aspirations to update
     */
    where?: AspirationWhereInput
    /**
     * Limit how many Aspirations to update.
     */
    limit?: number
  }

  /**
   * Aspiration updateManyAndReturn
   */
  export type AspirationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * The data used to update Aspirations.
     */
    data: XOR<AspirationUpdateManyMutationInput, AspirationUncheckedUpdateManyInput>
    /**
     * Filter which Aspirations to update
     */
    where?: AspirationWhereInput
    /**
     * Limit how many Aspirations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Aspiration upsert
   */
  export type AspirationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * The filter to search for the Aspiration to update in case it exists.
     */
    where: AspirationWhereUniqueInput
    /**
     * In case the Aspiration found by the `where` argument doesn't exist, create a new Aspiration with this data.
     */
    create: XOR<AspirationCreateInput, AspirationUncheckedCreateInput>
    /**
     * In case the Aspiration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AspirationUpdateInput, AspirationUncheckedUpdateInput>
  }

  /**
   * Aspiration delete
   */
  export type AspirationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
    /**
     * Filter which Aspiration to delete.
     */
    where: AspirationWhereUniqueInput
  }

  /**
   * Aspiration deleteMany
   */
  export type AspirationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Aspirations to delete
     */
    where?: AspirationWhereInput
    /**
     * Limit how many Aspirations to delete.
     */
    limit?: number
  }

  /**
   * Aspiration without action
   */
  export type AspirationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aspiration
     */
    select?: AspirationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Aspiration
     */
    omit?: AspirationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AspirationInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    amount: number | null
  }

  export type OrderSumAggregateOutputType = {
    amount: number | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    planType: string | null
    amount: number | null
    currency: string | null
    paymentMethod: string | null
    phoneNumber: string | null
    status: string | null
    createdAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    planType: string | null
    amount: number | null
    currency: string | null
    paymentMethod: string | null
    phoneNumber: string | null
    status: string | null
    createdAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    userId: number
    planType: number
    amount: number
    currency: number
    paymentMethod: number
    phoneNumber: number
    status: number
    createdAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    amount?: true
  }

  export type OrderSumAggregateInputType = {
    amount?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    userId?: true
    planType?: true
    amount?: true
    currency?: true
    paymentMethod?: true
    phoneNumber?: true
    status?: true
    createdAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    userId?: true
    planType?: true
    amount?: true
    currency?: true
    paymentMethod?: true
    phoneNumber?: true
    status?: true
    createdAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    userId?: true
    planType?: true
    amount?: true
    currency?: true
    paymentMethod?: true
    phoneNumber?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    userId: string
    planType: string
    amount: number
    currency: string
    paymentMethod: string
    phoneNumber: string | null
    status: string
    createdAt: Date
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    planType?: boolean
    amount?: boolean
    currency?: boolean
    paymentMethod?: boolean
    phoneNumber?: boolean
    status?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    planType?: boolean
    amount?: boolean
    currency?: boolean
    paymentMethod?: boolean
    phoneNumber?: boolean
    status?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    planType?: boolean
    amount?: boolean
    currency?: boolean
    paymentMethod?: boolean
    phoneNumber?: boolean
    status?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    userId?: boolean
    planType?: boolean
    amount?: boolean
    currency?: boolean
    paymentMethod?: boolean
    phoneNumber?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type OrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "planType" | "amount" | "currency" | "paymentMethod" | "phoneNumber" | "status" | "createdAt", ExtArgs["result"]["order"]>
  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      planType: string
      amount: number
      currency: string
      paymentMethod: string
      phoneNumber: string | null
      status: string
      createdAt: Date
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders and returns the data updated in the database.
     * @param {OrderUpdateManyAndReturnArgs} args - Arguments to update many Orders.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
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
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
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
   * Fields of the Order model
   */ 
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly userId: FieldRef<"Order", 'String'>
    readonly planType: FieldRef<"Order", 'String'>
    readonly amount: FieldRef<"Order", 'Float'>
    readonly currency: FieldRef<"Order", 'String'>
    readonly paymentMethod: FieldRef<"Order", 'String'>
    readonly phoneNumber: FieldRef<"Order", 'String'>
    readonly status: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order updateManyAndReturn
   */
  export type OrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to delete.
     */
    limit?: number
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model Assessment
   */

  export type AggregateAssessment = {
    _count: AssessmentCountAggregateOutputType | null
    _avg: AssessmentAvgAggregateOutputType | null
    _sum: AssessmentSumAggregateOutputType | null
    _min: AssessmentMinAggregateOutputType | null
    _max: AssessmentMaxAggregateOutputType | null
  }

  export type AssessmentAvgAggregateOutputType = {
    overallScore: number | null
  }

  export type AssessmentSumAggregateOutputType = {
    overallScore: number | null
  }

  export type AssessmentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    overallScore: number | null
    maturityLevel: string | null
    pillarScores: string | null
    radarData: string | null
    priorityAreas: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AssessmentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    overallScore: number | null
    maturityLevel: string | null
    pillarScores: string | null
    radarData: string | null
    priorityAreas: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AssessmentCountAggregateOutputType = {
    id: number
    userId: number
    overallScore: number
    maturityLevel: number
    pillarScores: number
    radarData: number
    priorityAreas: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AssessmentAvgAggregateInputType = {
    overallScore?: true
  }

  export type AssessmentSumAggregateInputType = {
    overallScore?: true
  }

  export type AssessmentMinAggregateInputType = {
    id?: true
    userId?: true
    overallScore?: true
    maturityLevel?: true
    pillarScores?: true
    radarData?: true
    priorityAreas?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AssessmentMaxAggregateInputType = {
    id?: true
    userId?: true
    overallScore?: true
    maturityLevel?: true
    pillarScores?: true
    radarData?: true
    priorityAreas?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AssessmentCountAggregateInputType = {
    id?: true
    userId?: true
    overallScore?: true
    maturityLevel?: true
    pillarScores?: true
    radarData?: true
    priorityAreas?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AssessmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assessment to aggregate.
     */
    where?: AssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assessments to fetch.
     */
    orderBy?: AssessmentOrderByWithRelationInput | AssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Assessments
    **/
    _count?: true | AssessmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssessmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssessmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssessmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssessmentMaxAggregateInputType
  }

  export type GetAssessmentAggregateType<T extends AssessmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAssessment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssessment[P]>
      : GetScalarType<T[P], AggregateAssessment[P]>
  }




  export type AssessmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssessmentWhereInput
    orderBy?: AssessmentOrderByWithAggregationInput | AssessmentOrderByWithAggregationInput[]
    by: AssessmentScalarFieldEnum[] | AssessmentScalarFieldEnum
    having?: AssessmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssessmentCountAggregateInputType | true
    _avg?: AssessmentAvgAggregateInputType
    _sum?: AssessmentSumAggregateInputType
    _min?: AssessmentMinAggregateInputType
    _max?: AssessmentMaxAggregateInputType
  }

  export type AssessmentGroupByOutputType = {
    id: string
    userId: string
    overallScore: number
    maturityLevel: string
    pillarScores: string
    radarData: string
    priorityAreas: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: AssessmentCountAggregateOutputType | null
    _avg: AssessmentAvgAggregateOutputType | null
    _sum: AssessmentSumAggregateOutputType | null
    _min: AssessmentMinAggregateOutputType | null
    _max: AssessmentMaxAggregateOutputType | null
  }

  type GetAssessmentGroupByPayload<T extends AssessmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssessmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssessmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssessmentGroupByOutputType[P]>
            : GetScalarType<T[P], AssessmentGroupByOutputType[P]>
        }
      >
    >


  export type AssessmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    overallScore?: boolean
    maturityLevel?: boolean
    pillarScores?: boolean
    radarData?: boolean
    priorityAreas?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    pillarAssessments?: boolean | Assessment$pillarAssessmentsArgs<ExtArgs>
    assessmentResponses?: boolean | Assessment$assessmentResponsesArgs<ExtArgs>
    _count?: boolean | AssessmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assessment"]>

  export type AssessmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    overallScore?: boolean
    maturityLevel?: boolean
    pillarScores?: boolean
    radarData?: boolean
    priorityAreas?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assessment"]>

  export type AssessmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    overallScore?: boolean
    maturityLevel?: boolean
    pillarScores?: boolean
    radarData?: boolean
    priorityAreas?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assessment"]>

  export type AssessmentSelectScalar = {
    id?: boolean
    userId?: boolean
    overallScore?: boolean
    maturityLevel?: boolean
    pillarScores?: boolean
    radarData?: boolean
    priorityAreas?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AssessmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "overallScore" | "maturityLevel" | "pillarScores" | "radarData" | "priorityAreas" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["assessment"]>
  export type AssessmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    pillarAssessments?: boolean | Assessment$pillarAssessmentsArgs<ExtArgs>
    assessmentResponses?: boolean | Assessment$assessmentResponsesArgs<ExtArgs>
    _count?: boolean | AssessmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AssessmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AssessmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AssessmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Assessment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      pillarAssessments: Prisma.$PillarAssessmentPayload<ExtArgs>[]
      assessmentResponses: Prisma.$AssessmentResponsePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      overallScore: number
      maturityLevel: string
      pillarScores: string
      radarData: string
      priorityAreas: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["assessment"]>
    composites: {}
  }

  type AssessmentGetPayload<S extends boolean | null | undefined | AssessmentDefaultArgs> = $Result.GetResult<Prisma.$AssessmentPayload, S>

  type AssessmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssessmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssessmentCountAggregateInputType | true
    }

  export interface AssessmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Assessment'], meta: { name: 'Assessment' } }
    /**
     * Find zero or one Assessment that matches the filter.
     * @param {AssessmentFindUniqueArgs} args - Arguments to find a Assessment
     * @example
     * // Get one Assessment
     * const assessment = await prisma.assessment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssessmentFindUniqueArgs>(args: SelectSubset<T, AssessmentFindUniqueArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one Assessment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssessmentFindUniqueOrThrowArgs} args - Arguments to find a Assessment
     * @example
     * // Get one Assessment
     * const assessment = await prisma.assessment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssessmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AssessmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first Assessment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentFindFirstArgs} args - Arguments to find a Assessment
     * @example
     * // Get one Assessment
     * const assessment = await prisma.assessment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssessmentFindFirstArgs>(args?: SelectSubset<T, AssessmentFindFirstArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first Assessment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentFindFirstOrThrowArgs} args - Arguments to find a Assessment
     * @example
     * // Get one Assessment
     * const assessment = await prisma.assessment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssessmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AssessmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more Assessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assessments
     * const assessments = await prisma.assessment.findMany()
     * 
     * // Get first 10 Assessments
     * const assessments = await prisma.assessment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assessmentWithIdOnly = await prisma.assessment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssessmentFindManyArgs>(args?: SelectSubset<T, AssessmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a Assessment.
     * @param {AssessmentCreateArgs} args - Arguments to create a Assessment.
     * @example
     * // Create one Assessment
     * const Assessment = await prisma.assessment.create({
     *   data: {
     *     // ... data to create a Assessment
     *   }
     * })
     * 
     */
    create<T extends AssessmentCreateArgs>(args: SelectSubset<T, AssessmentCreateArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many Assessments.
     * @param {AssessmentCreateManyArgs} args - Arguments to create many Assessments.
     * @example
     * // Create many Assessments
     * const assessment = await prisma.assessment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssessmentCreateManyArgs>(args?: SelectSubset<T, AssessmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assessments and returns the data saved in the database.
     * @param {AssessmentCreateManyAndReturnArgs} args - Arguments to create many Assessments.
     * @example
     * // Create many Assessments
     * const assessment = await prisma.assessment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assessments and only return the `id`
     * const assessmentWithIdOnly = await prisma.assessment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssessmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AssessmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a Assessment.
     * @param {AssessmentDeleteArgs} args - Arguments to delete one Assessment.
     * @example
     * // Delete one Assessment
     * const Assessment = await prisma.assessment.delete({
     *   where: {
     *     // ... filter to delete one Assessment
     *   }
     * })
     * 
     */
    delete<T extends AssessmentDeleteArgs>(args: SelectSubset<T, AssessmentDeleteArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one Assessment.
     * @param {AssessmentUpdateArgs} args - Arguments to update one Assessment.
     * @example
     * // Update one Assessment
     * const assessment = await prisma.assessment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssessmentUpdateArgs>(args: SelectSubset<T, AssessmentUpdateArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more Assessments.
     * @param {AssessmentDeleteManyArgs} args - Arguments to filter Assessments to delete.
     * @example
     * // Delete a few Assessments
     * const { count } = await prisma.assessment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssessmentDeleteManyArgs>(args?: SelectSubset<T, AssessmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assessments
     * const assessment = await prisma.assessment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssessmentUpdateManyArgs>(args: SelectSubset<T, AssessmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assessments and returns the data updated in the database.
     * @param {AssessmentUpdateManyAndReturnArgs} args - Arguments to update many Assessments.
     * @example
     * // Update many Assessments
     * const assessment = await prisma.assessment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Assessments and only return the `id`
     * const assessmentWithIdOnly = await prisma.assessment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssessmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AssessmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one Assessment.
     * @param {AssessmentUpsertArgs} args - Arguments to update or create a Assessment.
     * @example
     * // Update or create a Assessment
     * const assessment = await prisma.assessment.upsert({
     *   create: {
     *     // ... data to create a Assessment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Assessment we want to update
     *   }
     * })
     */
    upsert<T extends AssessmentUpsertArgs>(args: SelectSubset<T, AssessmentUpsertArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of Assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentCountArgs} args - Arguments to filter Assessments to count.
     * @example
     * // Count the number of Assessments
     * const count = await prisma.assessment.count({
     *   where: {
     *     // ... the filter for the Assessments we want to count
     *   }
     * })
    **/
    count<T extends AssessmentCountArgs>(
      args?: Subset<T, AssessmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssessmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Assessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AssessmentAggregateArgs>(args: Subset<T, AssessmentAggregateArgs>): Prisma.PrismaPromise<GetAssessmentAggregateType<T>>

    /**
     * Group by Assessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentGroupByArgs} args - Group by arguments.
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
      T extends AssessmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssessmentGroupByArgs['orderBy'] }
        : { orderBy?: AssessmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AssessmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssessmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Assessment model
   */
  readonly fields: AssessmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Assessment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssessmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
    pillarAssessments<T extends Assessment$pillarAssessmentsArgs<ExtArgs> = {}>(args?: Subset<T, Assessment$pillarAssessmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "findMany", ClientOptions> | Null>
    assessmentResponses<T extends Assessment$assessmentResponsesArgs<ExtArgs> = {}>(args?: Subset<T, Assessment$assessmentResponsesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "findMany", ClientOptions> | Null>
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
   * Fields of the Assessment model
   */ 
  interface AssessmentFieldRefs {
    readonly id: FieldRef<"Assessment", 'String'>
    readonly userId: FieldRef<"Assessment", 'String'>
    readonly overallScore: FieldRef<"Assessment", 'Int'>
    readonly maturityLevel: FieldRef<"Assessment", 'String'>
    readonly pillarScores: FieldRef<"Assessment", 'String'>
    readonly radarData: FieldRef<"Assessment", 'String'>
    readonly priorityAreas: FieldRef<"Assessment", 'String'>
    readonly status: FieldRef<"Assessment", 'String'>
    readonly createdAt: FieldRef<"Assessment", 'DateTime'>
    readonly updatedAt: FieldRef<"Assessment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Assessment findUnique
   */
  export type AssessmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * Filter, which Assessment to fetch.
     */
    where: AssessmentWhereUniqueInput
  }

  /**
   * Assessment findUniqueOrThrow
   */
  export type AssessmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * Filter, which Assessment to fetch.
     */
    where: AssessmentWhereUniqueInput
  }

  /**
   * Assessment findFirst
   */
  export type AssessmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * Filter, which Assessment to fetch.
     */
    where?: AssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assessments to fetch.
     */
    orderBy?: AssessmentOrderByWithRelationInput | AssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assessments.
     */
    cursor?: AssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assessments.
     */
    distinct?: AssessmentScalarFieldEnum | AssessmentScalarFieldEnum[]
  }

  /**
   * Assessment findFirstOrThrow
   */
  export type AssessmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * Filter, which Assessment to fetch.
     */
    where?: AssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assessments to fetch.
     */
    orderBy?: AssessmentOrderByWithRelationInput | AssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assessments.
     */
    cursor?: AssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assessments.
     */
    distinct?: AssessmentScalarFieldEnum | AssessmentScalarFieldEnum[]
  }

  /**
   * Assessment findMany
   */
  export type AssessmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * Filter, which Assessments to fetch.
     */
    where?: AssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assessments to fetch.
     */
    orderBy?: AssessmentOrderByWithRelationInput | AssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Assessments.
     */
    cursor?: AssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assessments.
     */
    skip?: number
    distinct?: AssessmentScalarFieldEnum | AssessmentScalarFieldEnum[]
  }

  /**
   * Assessment create
   */
  export type AssessmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Assessment.
     */
    data: XOR<AssessmentCreateInput, AssessmentUncheckedCreateInput>
  }

  /**
   * Assessment createMany
   */
  export type AssessmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Assessments.
     */
    data: AssessmentCreateManyInput | AssessmentCreateManyInput[]
  }

  /**
   * Assessment createManyAndReturn
   */
  export type AssessmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * The data used to create many Assessments.
     */
    data: AssessmentCreateManyInput | AssessmentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Assessment update
   */
  export type AssessmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Assessment.
     */
    data: XOR<AssessmentUpdateInput, AssessmentUncheckedUpdateInput>
    /**
     * Choose, which Assessment to update.
     */
    where: AssessmentWhereUniqueInput
  }

  /**
   * Assessment updateMany
   */
  export type AssessmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Assessments.
     */
    data: XOR<AssessmentUpdateManyMutationInput, AssessmentUncheckedUpdateManyInput>
    /**
     * Filter which Assessments to update
     */
    where?: AssessmentWhereInput
    /**
     * Limit how many Assessments to update.
     */
    limit?: number
  }

  /**
   * Assessment updateManyAndReturn
   */
  export type AssessmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * The data used to update Assessments.
     */
    data: XOR<AssessmentUpdateManyMutationInput, AssessmentUncheckedUpdateManyInput>
    /**
     * Filter which Assessments to update
     */
    where?: AssessmentWhereInput
    /**
     * Limit how many Assessments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Assessment upsert
   */
  export type AssessmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Assessment to update in case it exists.
     */
    where: AssessmentWhereUniqueInput
    /**
     * In case the Assessment found by the `where` argument doesn't exist, create a new Assessment with this data.
     */
    create: XOR<AssessmentCreateInput, AssessmentUncheckedCreateInput>
    /**
     * In case the Assessment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssessmentUpdateInput, AssessmentUncheckedUpdateInput>
  }

  /**
   * Assessment delete
   */
  export type AssessmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
    /**
     * Filter which Assessment to delete.
     */
    where: AssessmentWhereUniqueInput
  }

  /**
   * Assessment deleteMany
   */
  export type AssessmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assessments to delete
     */
    where?: AssessmentWhereInput
    /**
     * Limit how many Assessments to delete.
     */
    limit?: number
  }

  /**
   * Assessment.pillarAssessments
   */
  export type Assessment$pillarAssessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    where?: PillarAssessmentWhereInput
    orderBy?: PillarAssessmentOrderByWithRelationInput | PillarAssessmentOrderByWithRelationInput[]
    cursor?: PillarAssessmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PillarAssessmentScalarFieldEnum | PillarAssessmentScalarFieldEnum[]
  }

  /**
   * Assessment.assessmentResponses
   */
  export type Assessment$assessmentResponsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    where?: AssessmentResponseWhereInput
    orderBy?: AssessmentResponseOrderByWithRelationInput | AssessmentResponseOrderByWithRelationInput[]
    cursor?: AssessmentResponseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssessmentResponseScalarFieldEnum | AssessmentResponseScalarFieldEnum[]
  }

  /**
   * Assessment without action
   */
  export type AssessmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessment
     */
    select?: AssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessment
     */
    omit?: AssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentInclude<ExtArgs> | null
  }


  /**
   * Model PillarAssessment
   */

  export type AggregatePillarAssessment = {
    _count: PillarAssessmentCountAggregateOutputType | null
    _avg: PillarAssessmentAvgAggregateOutputType | null
    _sum: PillarAssessmentSumAggregateOutputType | null
    _min: PillarAssessmentMinAggregateOutputType | null
    _max: PillarAssessmentMaxAggregateOutputType | null
  }

  export type PillarAssessmentAvgAggregateOutputType = {
    pillarId: number | null
    score: number | null
    yesCount: number | null
    noCount: number | null
    totalQuestions: number | null
  }

  export type PillarAssessmentSumAggregateOutputType = {
    pillarId: number | null
    score: number | null
    yesCount: number | null
    noCount: number | null
    totalQuestions: number | null
  }

  export type PillarAssessmentMinAggregateOutputType = {
    id: string | null
    assessmentId: string | null
    pillarId: number | null
    pillarName: string | null
    score: number | null
    yesCount: number | null
    noCount: number | null
    totalQuestions: number | null
    maturityLevel: string | null
    capabilityScores: string | null
    isCompleted: boolean | null
    completedAt: Date | null
    updatedAt: Date | null
  }

  export type PillarAssessmentMaxAggregateOutputType = {
    id: string | null
    assessmentId: string | null
    pillarId: number | null
    pillarName: string | null
    score: number | null
    yesCount: number | null
    noCount: number | null
    totalQuestions: number | null
    maturityLevel: string | null
    capabilityScores: string | null
    isCompleted: boolean | null
    completedAt: Date | null
    updatedAt: Date | null
  }

  export type PillarAssessmentCountAggregateOutputType = {
    id: number
    assessmentId: number
    pillarId: number
    pillarName: number
    score: number
    yesCount: number
    noCount: number
    totalQuestions: number
    maturityLevel: number
    capabilityScores: number
    isCompleted: number
    completedAt: number
    updatedAt: number
    _all: number
  }


  export type PillarAssessmentAvgAggregateInputType = {
    pillarId?: true
    score?: true
    yesCount?: true
    noCount?: true
    totalQuestions?: true
  }

  export type PillarAssessmentSumAggregateInputType = {
    pillarId?: true
    score?: true
    yesCount?: true
    noCount?: true
    totalQuestions?: true
  }

  export type PillarAssessmentMinAggregateInputType = {
    id?: true
    assessmentId?: true
    pillarId?: true
    pillarName?: true
    score?: true
    yesCount?: true
    noCount?: true
    totalQuestions?: true
    maturityLevel?: true
    capabilityScores?: true
    isCompleted?: true
    completedAt?: true
    updatedAt?: true
  }

  export type PillarAssessmentMaxAggregateInputType = {
    id?: true
    assessmentId?: true
    pillarId?: true
    pillarName?: true
    score?: true
    yesCount?: true
    noCount?: true
    totalQuestions?: true
    maturityLevel?: true
    capabilityScores?: true
    isCompleted?: true
    completedAt?: true
    updatedAt?: true
  }

  export type PillarAssessmentCountAggregateInputType = {
    id?: true
    assessmentId?: true
    pillarId?: true
    pillarName?: true
    score?: true
    yesCount?: true
    noCount?: true
    totalQuestions?: true
    maturityLevel?: true
    capabilityScores?: true
    isCompleted?: true
    completedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PillarAssessmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PillarAssessment to aggregate.
     */
    where?: PillarAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PillarAssessments to fetch.
     */
    orderBy?: PillarAssessmentOrderByWithRelationInput | PillarAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PillarAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PillarAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PillarAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PillarAssessments
    **/
    _count?: true | PillarAssessmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PillarAssessmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PillarAssessmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PillarAssessmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PillarAssessmentMaxAggregateInputType
  }

  export type GetPillarAssessmentAggregateType<T extends PillarAssessmentAggregateArgs> = {
        [P in keyof T & keyof AggregatePillarAssessment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePillarAssessment[P]>
      : GetScalarType<T[P], AggregatePillarAssessment[P]>
  }




  export type PillarAssessmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PillarAssessmentWhereInput
    orderBy?: PillarAssessmentOrderByWithAggregationInput | PillarAssessmentOrderByWithAggregationInput[]
    by: PillarAssessmentScalarFieldEnum[] | PillarAssessmentScalarFieldEnum
    having?: PillarAssessmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PillarAssessmentCountAggregateInputType | true
    _avg?: PillarAssessmentAvgAggregateInputType
    _sum?: PillarAssessmentSumAggregateInputType
    _min?: PillarAssessmentMinAggregateInputType
    _max?: PillarAssessmentMaxAggregateInputType
  }

  export type PillarAssessmentGroupByOutputType = {
    id: string
    assessmentId: string
    pillarId: number
    pillarName: string
    score: number
    yesCount: number
    noCount: number
    totalQuestions: number
    maturityLevel: string
    capabilityScores: string
    isCompleted: boolean
    completedAt: Date | null
    updatedAt: Date
    _count: PillarAssessmentCountAggregateOutputType | null
    _avg: PillarAssessmentAvgAggregateOutputType | null
    _sum: PillarAssessmentSumAggregateOutputType | null
    _min: PillarAssessmentMinAggregateOutputType | null
    _max: PillarAssessmentMaxAggregateOutputType | null
  }

  type GetPillarAssessmentGroupByPayload<T extends PillarAssessmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PillarAssessmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PillarAssessmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PillarAssessmentGroupByOutputType[P]>
            : GetScalarType<T[P], PillarAssessmentGroupByOutputType[P]>
        }
      >
    >


  export type PillarAssessmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assessmentId?: boolean
    pillarId?: boolean
    pillarName?: boolean
    score?: boolean
    yesCount?: boolean
    noCount?: boolean
    totalQuestions?: boolean
    maturityLevel?: boolean
    capabilityScores?: boolean
    isCompleted?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pillarAssessment"]>

  export type PillarAssessmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assessmentId?: boolean
    pillarId?: boolean
    pillarName?: boolean
    score?: boolean
    yesCount?: boolean
    noCount?: boolean
    totalQuestions?: boolean
    maturityLevel?: boolean
    capabilityScores?: boolean
    isCompleted?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pillarAssessment"]>

  export type PillarAssessmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assessmentId?: boolean
    pillarId?: boolean
    pillarName?: boolean
    score?: boolean
    yesCount?: boolean
    noCount?: boolean
    totalQuestions?: boolean
    maturityLevel?: boolean
    capabilityScores?: boolean
    isCompleted?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pillarAssessment"]>

  export type PillarAssessmentSelectScalar = {
    id?: boolean
    assessmentId?: boolean
    pillarId?: boolean
    pillarName?: boolean
    score?: boolean
    yesCount?: boolean
    noCount?: boolean
    totalQuestions?: boolean
    maturityLevel?: boolean
    capabilityScores?: boolean
    isCompleted?: boolean
    completedAt?: boolean
    updatedAt?: boolean
  }

  export type PillarAssessmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assessmentId" | "pillarId" | "pillarName" | "score" | "yesCount" | "noCount" | "totalQuestions" | "maturityLevel" | "capabilityScores" | "isCompleted" | "completedAt" | "updatedAt", ExtArgs["result"]["pillarAssessment"]>
  export type PillarAssessmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }
  export type PillarAssessmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }
  export type PillarAssessmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }

  export type $PillarAssessmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PillarAssessment"
    objects: {
      assessment: Prisma.$AssessmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assessmentId: string
      pillarId: number
      pillarName: string
      score: number
      yesCount: number
      noCount: number
      totalQuestions: number
      maturityLevel: string
      capabilityScores: string
      isCompleted: boolean
      completedAt: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["pillarAssessment"]>
    composites: {}
  }

  type PillarAssessmentGetPayload<S extends boolean | null | undefined | PillarAssessmentDefaultArgs> = $Result.GetResult<Prisma.$PillarAssessmentPayload, S>

  type PillarAssessmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PillarAssessmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PillarAssessmentCountAggregateInputType | true
    }

  export interface PillarAssessmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PillarAssessment'], meta: { name: 'PillarAssessment' } }
    /**
     * Find zero or one PillarAssessment that matches the filter.
     * @param {PillarAssessmentFindUniqueArgs} args - Arguments to find a PillarAssessment
     * @example
     * // Get one PillarAssessment
     * const pillarAssessment = await prisma.pillarAssessment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PillarAssessmentFindUniqueArgs>(args: SelectSubset<T, PillarAssessmentFindUniqueArgs<ExtArgs>>): Prisma__PillarAssessmentClient<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one PillarAssessment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PillarAssessmentFindUniqueOrThrowArgs} args - Arguments to find a PillarAssessment
     * @example
     * // Get one PillarAssessment
     * const pillarAssessment = await prisma.pillarAssessment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PillarAssessmentFindUniqueOrThrowArgs>(args: SelectSubset<T, PillarAssessmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PillarAssessmentClient<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first PillarAssessment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PillarAssessmentFindFirstArgs} args - Arguments to find a PillarAssessment
     * @example
     * // Get one PillarAssessment
     * const pillarAssessment = await prisma.pillarAssessment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PillarAssessmentFindFirstArgs>(args?: SelectSubset<T, PillarAssessmentFindFirstArgs<ExtArgs>>): Prisma__PillarAssessmentClient<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first PillarAssessment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PillarAssessmentFindFirstOrThrowArgs} args - Arguments to find a PillarAssessment
     * @example
     * // Get one PillarAssessment
     * const pillarAssessment = await prisma.pillarAssessment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PillarAssessmentFindFirstOrThrowArgs>(args?: SelectSubset<T, PillarAssessmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PillarAssessmentClient<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more PillarAssessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PillarAssessmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PillarAssessments
     * const pillarAssessments = await prisma.pillarAssessment.findMany()
     * 
     * // Get first 10 PillarAssessments
     * const pillarAssessments = await prisma.pillarAssessment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pillarAssessmentWithIdOnly = await prisma.pillarAssessment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PillarAssessmentFindManyArgs>(args?: SelectSubset<T, PillarAssessmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a PillarAssessment.
     * @param {PillarAssessmentCreateArgs} args - Arguments to create a PillarAssessment.
     * @example
     * // Create one PillarAssessment
     * const PillarAssessment = await prisma.pillarAssessment.create({
     *   data: {
     *     // ... data to create a PillarAssessment
     *   }
     * })
     * 
     */
    create<T extends PillarAssessmentCreateArgs>(args: SelectSubset<T, PillarAssessmentCreateArgs<ExtArgs>>): Prisma__PillarAssessmentClient<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many PillarAssessments.
     * @param {PillarAssessmentCreateManyArgs} args - Arguments to create many PillarAssessments.
     * @example
     * // Create many PillarAssessments
     * const pillarAssessment = await prisma.pillarAssessment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PillarAssessmentCreateManyArgs>(args?: SelectSubset<T, PillarAssessmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PillarAssessments and returns the data saved in the database.
     * @param {PillarAssessmentCreateManyAndReturnArgs} args - Arguments to create many PillarAssessments.
     * @example
     * // Create many PillarAssessments
     * const pillarAssessment = await prisma.pillarAssessment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PillarAssessments and only return the `id`
     * const pillarAssessmentWithIdOnly = await prisma.pillarAssessment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PillarAssessmentCreateManyAndReturnArgs>(args?: SelectSubset<T, PillarAssessmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a PillarAssessment.
     * @param {PillarAssessmentDeleteArgs} args - Arguments to delete one PillarAssessment.
     * @example
     * // Delete one PillarAssessment
     * const PillarAssessment = await prisma.pillarAssessment.delete({
     *   where: {
     *     // ... filter to delete one PillarAssessment
     *   }
     * })
     * 
     */
    delete<T extends PillarAssessmentDeleteArgs>(args: SelectSubset<T, PillarAssessmentDeleteArgs<ExtArgs>>): Prisma__PillarAssessmentClient<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one PillarAssessment.
     * @param {PillarAssessmentUpdateArgs} args - Arguments to update one PillarAssessment.
     * @example
     * // Update one PillarAssessment
     * const pillarAssessment = await prisma.pillarAssessment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PillarAssessmentUpdateArgs>(args: SelectSubset<T, PillarAssessmentUpdateArgs<ExtArgs>>): Prisma__PillarAssessmentClient<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more PillarAssessments.
     * @param {PillarAssessmentDeleteManyArgs} args - Arguments to filter PillarAssessments to delete.
     * @example
     * // Delete a few PillarAssessments
     * const { count } = await prisma.pillarAssessment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PillarAssessmentDeleteManyArgs>(args?: SelectSubset<T, PillarAssessmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PillarAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PillarAssessmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PillarAssessments
     * const pillarAssessment = await prisma.pillarAssessment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PillarAssessmentUpdateManyArgs>(args: SelectSubset<T, PillarAssessmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PillarAssessments and returns the data updated in the database.
     * @param {PillarAssessmentUpdateManyAndReturnArgs} args - Arguments to update many PillarAssessments.
     * @example
     * // Update many PillarAssessments
     * const pillarAssessment = await prisma.pillarAssessment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PillarAssessments and only return the `id`
     * const pillarAssessmentWithIdOnly = await prisma.pillarAssessment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PillarAssessmentUpdateManyAndReturnArgs>(args: SelectSubset<T, PillarAssessmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one PillarAssessment.
     * @param {PillarAssessmentUpsertArgs} args - Arguments to update or create a PillarAssessment.
     * @example
     * // Update or create a PillarAssessment
     * const pillarAssessment = await prisma.pillarAssessment.upsert({
     *   create: {
     *     // ... data to create a PillarAssessment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PillarAssessment we want to update
     *   }
     * })
     */
    upsert<T extends PillarAssessmentUpsertArgs>(args: SelectSubset<T, PillarAssessmentUpsertArgs<ExtArgs>>): Prisma__PillarAssessmentClient<$Result.GetResult<Prisma.$PillarAssessmentPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of PillarAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PillarAssessmentCountArgs} args - Arguments to filter PillarAssessments to count.
     * @example
     * // Count the number of PillarAssessments
     * const count = await prisma.pillarAssessment.count({
     *   where: {
     *     // ... the filter for the PillarAssessments we want to count
     *   }
     * })
    **/
    count<T extends PillarAssessmentCountArgs>(
      args?: Subset<T, PillarAssessmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PillarAssessmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PillarAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PillarAssessmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PillarAssessmentAggregateArgs>(args: Subset<T, PillarAssessmentAggregateArgs>): Prisma.PrismaPromise<GetPillarAssessmentAggregateType<T>>

    /**
     * Group by PillarAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PillarAssessmentGroupByArgs} args - Group by arguments.
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
      T extends PillarAssessmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PillarAssessmentGroupByArgs['orderBy'] }
        : { orderBy?: PillarAssessmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PillarAssessmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPillarAssessmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PillarAssessment model
   */
  readonly fields: PillarAssessmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PillarAssessment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PillarAssessmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assessment<T extends AssessmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AssessmentDefaultArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
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
   * Fields of the PillarAssessment model
   */ 
  interface PillarAssessmentFieldRefs {
    readonly id: FieldRef<"PillarAssessment", 'String'>
    readonly assessmentId: FieldRef<"PillarAssessment", 'String'>
    readonly pillarId: FieldRef<"PillarAssessment", 'Int'>
    readonly pillarName: FieldRef<"PillarAssessment", 'String'>
    readonly score: FieldRef<"PillarAssessment", 'Float'>
    readonly yesCount: FieldRef<"PillarAssessment", 'Int'>
    readonly noCount: FieldRef<"PillarAssessment", 'Int'>
    readonly totalQuestions: FieldRef<"PillarAssessment", 'Int'>
    readonly maturityLevel: FieldRef<"PillarAssessment", 'String'>
    readonly capabilityScores: FieldRef<"PillarAssessment", 'String'>
    readonly isCompleted: FieldRef<"PillarAssessment", 'Boolean'>
    readonly completedAt: FieldRef<"PillarAssessment", 'DateTime'>
    readonly updatedAt: FieldRef<"PillarAssessment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PillarAssessment findUnique
   */
  export type PillarAssessmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * Filter, which PillarAssessment to fetch.
     */
    where: PillarAssessmentWhereUniqueInput
  }

  /**
   * PillarAssessment findUniqueOrThrow
   */
  export type PillarAssessmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * Filter, which PillarAssessment to fetch.
     */
    where: PillarAssessmentWhereUniqueInput
  }

  /**
   * PillarAssessment findFirst
   */
  export type PillarAssessmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * Filter, which PillarAssessment to fetch.
     */
    where?: PillarAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PillarAssessments to fetch.
     */
    orderBy?: PillarAssessmentOrderByWithRelationInput | PillarAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PillarAssessments.
     */
    cursor?: PillarAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PillarAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PillarAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PillarAssessments.
     */
    distinct?: PillarAssessmentScalarFieldEnum | PillarAssessmentScalarFieldEnum[]
  }

  /**
   * PillarAssessment findFirstOrThrow
   */
  export type PillarAssessmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * Filter, which PillarAssessment to fetch.
     */
    where?: PillarAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PillarAssessments to fetch.
     */
    orderBy?: PillarAssessmentOrderByWithRelationInput | PillarAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PillarAssessments.
     */
    cursor?: PillarAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PillarAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PillarAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PillarAssessments.
     */
    distinct?: PillarAssessmentScalarFieldEnum | PillarAssessmentScalarFieldEnum[]
  }

  /**
   * PillarAssessment findMany
   */
  export type PillarAssessmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * Filter, which PillarAssessments to fetch.
     */
    where?: PillarAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PillarAssessments to fetch.
     */
    orderBy?: PillarAssessmentOrderByWithRelationInput | PillarAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PillarAssessments.
     */
    cursor?: PillarAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PillarAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PillarAssessments.
     */
    skip?: number
    distinct?: PillarAssessmentScalarFieldEnum | PillarAssessmentScalarFieldEnum[]
  }

  /**
   * PillarAssessment create
   */
  export type PillarAssessmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * The data needed to create a PillarAssessment.
     */
    data: XOR<PillarAssessmentCreateInput, PillarAssessmentUncheckedCreateInput>
  }

  /**
   * PillarAssessment createMany
   */
  export type PillarAssessmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PillarAssessments.
     */
    data: PillarAssessmentCreateManyInput | PillarAssessmentCreateManyInput[]
  }

  /**
   * PillarAssessment createManyAndReturn
   */
  export type PillarAssessmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * The data used to create many PillarAssessments.
     */
    data: PillarAssessmentCreateManyInput | PillarAssessmentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PillarAssessment update
   */
  export type PillarAssessmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * The data needed to update a PillarAssessment.
     */
    data: XOR<PillarAssessmentUpdateInput, PillarAssessmentUncheckedUpdateInput>
    /**
     * Choose, which PillarAssessment to update.
     */
    where: PillarAssessmentWhereUniqueInput
  }

  /**
   * PillarAssessment updateMany
   */
  export type PillarAssessmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PillarAssessments.
     */
    data: XOR<PillarAssessmentUpdateManyMutationInput, PillarAssessmentUncheckedUpdateManyInput>
    /**
     * Filter which PillarAssessments to update
     */
    where?: PillarAssessmentWhereInput
    /**
     * Limit how many PillarAssessments to update.
     */
    limit?: number
  }

  /**
   * PillarAssessment updateManyAndReturn
   */
  export type PillarAssessmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * The data used to update PillarAssessments.
     */
    data: XOR<PillarAssessmentUpdateManyMutationInput, PillarAssessmentUncheckedUpdateManyInput>
    /**
     * Filter which PillarAssessments to update
     */
    where?: PillarAssessmentWhereInput
    /**
     * Limit how many PillarAssessments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PillarAssessment upsert
   */
  export type PillarAssessmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * The filter to search for the PillarAssessment to update in case it exists.
     */
    where: PillarAssessmentWhereUniqueInput
    /**
     * In case the PillarAssessment found by the `where` argument doesn't exist, create a new PillarAssessment with this data.
     */
    create: XOR<PillarAssessmentCreateInput, PillarAssessmentUncheckedCreateInput>
    /**
     * In case the PillarAssessment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PillarAssessmentUpdateInput, PillarAssessmentUncheckedUpdateInput>
  }

  /**
   * PillarAssessment delete
   */
  export type PillarAssessmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
    /**
     * Filter which PillarAssessment to delete.
     */
    where: PillarAssessmentWhereUniqueInput
  }

  /**
   * PillarAssessment deleteMany
   */
  export type PillarAssessmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PillarAssessments to delete
     */
    where?: PillarAssessmentWhereInput
    /**
     * Limit how many PillarAssessments to delete.
     */
    limit?: number
  }

  /**
   * PillarAssessment without action
   */
  export type PillarAssessmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PillarAssessment
     */
    select?: PillarAssessmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PillarAssessment
     */
    omit?: PillarAssessmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PillarAssessmentInclude<ExtArgs> | null
  }


  /**
   * Model AssessmentResponse
   */

  export type AggregateAssessmentResponse = {
    _count: AssessmentResponseCountAggregateOutputType | null
    _avg: AssessmentResponseAvgAggregateOutputType | null
    _sum: AssessmentResponseSumAggregateOutputType | null
    _min: AssessmentResponseMinAggregateOutputType | null
    _max: AssessmentResponseMaxAggregateOutputType | null
  }

  export type AssessmentResponseAvgAggregateOutputType = {
    pillarId: number | null
  }

  export type AssessmentResponseSumAggregateOutputType = {
    pillarId: number | null
  }

  export type AssessmentResponseMinAggregateOutputType = {
    id: string | null
    assessmentId: string | null
    pillarId: number | null
    capabilityId: string | null
    capabilityName: string | null
    questionId: string | null
    questionText: string | null
    answer: string | null
    recommendation: string | null
    whyItMatters: string | null
    quickWin: string | null
    supportAvailable: string | null
    priority: string | null
    updatedAt: Date | null
  }

  export type AssessmentResponseMaxAggregateOutputType = {
    id: string | null
    assessmentId: string | null
    pillarId: number | null
    capabilityId: string | null
    capabilityName: string | null
    questionId: string | null
    questionText: string | null
    answer: string | null
    recommendation: string | null
    whyItMatters: string | null
    quickWin: string | null
    supportAvailable: string | null
    priority: string | null
    updatedAt: Date | null
  }

  export type AssessmentResponseCountAggregateOutputType = {
    id: number
    assessmentId: number
    pillarId: number
    capabilityId: number
    capabilityName: number
    questionId: number
    questionText: number
    answer: number
    recommendation: number
    whyItMatters: number
    quickWin: number
    supportAvailable: number
    priority: number
    updatedAt: number
    _all: number
  }


  export type AssessmentResponseAvgAggregateInputType = {
    pillarId?: true
  }

  export type AssessmentResponseSumAggregateInputType = {
    pillarId?: true
  }

  export type AssessmentResponseMinAggregateInputType = {
    id?: true
    assessmentId?: true
    pillarId?: true
    capabilityId?: true
    capabilityName?: true
    questionId?: true
    questionText?: true
    answer?: true
    recommendation?: true
    whyItMatters?: true
    quickWin?: true
    supportAvailable?: true
    priority?: true
    updatedAt?: true
  }

  export type AssessmentResponseMaxAggregateInputType = {
    id?: true
    assessmentId?: true
    pillarId?: true
    capabilityId?: true
    capabilityName?: true
    questionId?: true
    questionText?: true
    answer?: true
    recommendation?: true
    whyItMatters?: true
    quickWin?: true
    supportAvailable?: true
    priority?: true
    updatedAt?: true
  }

  export type AssessmentResponseCountAggregateInputType = {
    id?: true
    assessmentId?: true
    pillarId?: true
    capabilityId?: true
    capabilityName?: true
    questionId?: true
    questionText?: true
    answer?: true
    recommendation?: true
    whyItMatters?: true
    quickWin?: true
    supportAvailable?: true
    priority?: true
    updatedAt?: true
    _all?: true
  }

  export type AssessmentResponseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssessmentResponse to aggregate.
     */
    where?: AssessmentResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssessmentResponses to fetch.
     */
    orderBy?: AssessmentResponseOrderByWithRelationInput | AssessmentResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssessmentResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssessmentResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssessmentResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssessmentResponses
    **/
    _count?: true | AssessmentResponseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssessmentResponseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssessmentResponseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssessmentResponseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssessmentResponseMaxAggregateInputType
  }

  export type GetAssessmentResponseAggregateType<T extends AssessmentResponseAggregateArgs> = {
        [P in keyof T & keyof AggregateAssessmentResponse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssessmentResponse[P]>
      : GetScalarType<T[P], AggregateAssessmentResponse[P]>
  }




  export type AssessmentResponseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssessmentResponseWhereInput
    orderBy?: AssessmentResponseOrderByWithAggregationInput | AssessmentResponseOrderByWithAggregationInput[]
    by: AssessmentResponseScalarFieldEnum[] | AssessmentResponseScalarFieldEnum
    having?: AssessmentResponseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssessmentResponseCountAggregateInputType | true
    _avg?: AssessmentResponseAvgAggregateInputType
    _sum?: AssessmentResponseSumAggregateInputType
    _min?: AssessmentResponseMinAggregateInputType
    _max?: AssessmentResponseMaxAggregateInputType
  }

  export type AssessmentResponseGroupByOutputType = {
    id: string
    assessmentId: string
    pillarId: number
    capabilityId: string
    capabilityName: string | null
    questionId: string
    questionText: string
    answer: string
    recommendation: string | null
    whyItMatters: string | null
    quickWin: string | null
    supportAvailable: string | null
    priority: string | null
    updatedAt: Date
    _count: AssessmentResponseCountAggregateOutputType | null
    _avg: AssessmentResponseAvgAggregateOutputType | null
    _sum: AssessmentResponseSumAggregateOutputType | null
    _min: AssessmentResponseMinAggregateOutputType | null
    _max: AssessmentResponseMaxAggregateOutputType | null
  }

  type GetAssessmentResponseGroupByPayload<T extends AssessmentResponseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssessmentResponseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssessmentResponseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssessmentResponseGroupByOutputType[P]>
            : GetScalarType<T[P], AssessmentResponseGroupByOutputType[P]>
        }
      >
    >


  export type AssessmentResponseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assessmentId?: boolean
    pillarId?: boolean
    capabilityId?: boolean
    capabilityName?: boolean
    questionId?: boolean
    questionText?: boolean
    answer?: boolean
    recommendation?: boolean
    whyItMatters?: boolean
    quickWin?: boolean
    supportAvailable?: boolean
    priority?: boolean
    updatedAt?: boolean
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assessmentResponse"]>

  export type AssessmentResponseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assessmentId?: boolean
    pillarId?: boolean
    capabilityId?: boolean
    capabilityName?: boolean
    questionId?: boolean
    questionText?: boolean
    answer?: boolean
    recommendation?: boolean
    whyItMatters?: boolean
    quickWin?: boolean
    supportAvailable?: boolean
    priority?: boolean
    updatedAt?: boolean
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assessmentResponse"]>

  export type AssessmentResponseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assessmentId?: boolean
    pillarId?: boolean
    capabilityId?: boolean
    capabilityName?: boolean
    questionId?: boolean
    questionText?: boolean
    answer?: boolean
    recommendation?: boolean
    whyItMatters?: boolean
    quickWin?: boolean
    supportAvailable?: boolean
    priority?: boolean
    updatedAt?: boolean
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assessmentResponse"]>

  export type AssessmentResponseSelectScalar = {
    id?: boolean
    assessmentId?: boolean
    pillarId?: boolean
    capabilityId?: boolean
    capabilityName?: boolean
    questionId?: boolean
    questionText?: boolean
    answer?: boolean
    recommendation?: boolean
    whyItMatters?: boolean
    quickWin?: boolean
    supportAvailable?: boolean
    priority?: boolean
    updatedAt?: boolean
  }

  export type AssessmentResponseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assessmentId" | "pillarId" | "capabilityId" | "capabilityName" | "questionId" | "questionText" | "answer" | "recommendation" | "whyItMatters" | "quickWin" | "supportAvailable" | "priority" | "updatedAt", ExtArgs["result"]["assessmentResponse"]>
  export type AssessmentResponseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }
  export type AssessmentResponseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }
  export type AssessmentResponseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assessment?: boolean | AssessmentDefaultArgs<ExtArgs>
  }

  export type $AssessmentResponsePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssessmentResponse"
    objects: {
      assessment: Prisma.$AssessmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assessmentId: string
      pillarId: number
      capabilityId: string
      capabilityName: string | null
      questionId: string
      questionText: string
      answer: string
      recommendation: string | null
      whyItMatters: string | null
      quickWin: string | null
      supportAvailable: string | null
      priority: string | null
      updatedAt: Date
    }, ExtArgs["result"]["assessmentResponse"]>
    composites: {}
  }

  type AssessmentResponseGetPayload<S extends boolean | null | undefined | AssessmentResponseDefaultArgs> = $Result.GetResult<Prisma.$AssessmentResponsePayload, S>

  type AssessmentResponseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssessmentResponseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssessmentResponseCountAggregateInputType | true
    }

  export interface AssessmentResponseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssessmentResponse'], meta: { name: 'AssessmentResponse' } }
    /**
     * Find zero or one AssessmentResponse that matches the filter.
     * @param {AssessmentResponseFindUniqueArgs} args - Arguments to find a AssessmentResponse
     * @example
     * // Get one AssessmentResponse
     * const assessmentResponse = await prisma.assessmentResponse.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssessmentResponseFindUniqueArgs>(args: SelectSubset<T, AssessmentResponseFindUniqueArgs<ExtArgs>>): Prisma__AssessmentResponseClient<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one AssessmentResponse that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssessmentResponseFindUniqueOrThrowArgs} args - Arguments to find a AssessmentResponse
     * @example
     * // Get one AssessmentResponse
     * const assessmentResponse = await prisma.assessmentResponse.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssessmentResponseFindUniqueOrThrowArgs>(args: SelectSubset<T, AssessmentResponseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssessmentResponseClient<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first AssessmentResponse that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentResponseFindFirstArgs} args - Arguments to find a AssessmentResponse
     * @example
     * // Get one AssessmentResponse
     * const assessmentResponse = await prisma.assessmentResponse.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssessmentResponseFindFirstArgs>(args?: SelectSubset<T, AssessmentResponseFindFirstArgs<ExtArgs>>): Prisma__AssessmentResponseClient<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first AssessmentResponse that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentResponseFindFirstOrThrowArgs} args - Arguments to find a AssessmentResponse
     * @example
     * // Get one AssessmentResponse
     * const assessmentResponse = await prisma.assessmentResponse.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssessmentResponseFindFirstOrThrowArgs>(args?: SelectSubset<T, AssessmentResponseFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssessmentResponseClient<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more AssessmentResponses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentResponseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssessmentResponses
     * const assessmentResponses = await prisma.assessmentResponse.findMany()
     * 
     * // Get first 10 AssessmentResponses
     * const assessmentResponses = await prisma.assessmentResponse.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assessmentResponseWithIdOnly = await prisma.assessmentResponse.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssessmentResponseFindManyArgs>(args?: SelectSubset<T, AssessmentResponseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a AssessmentResponse.
     * @param {AssessmentResponseCreateArgs} args - Arguments to create a AssessmentResponse.
     * @example
     * // Create one AssessmentResponse
     * const AssessmentResponse = await prisma.assessmentResponse.create({
     *   data: {
     *     // ... data to create a AssessmentResponse
     *   }
     * })
     * 
     */
    create<T extends AssessmentResponseCreateArgs>(args: SelectSubset<T, AssessmentResponseCreateArgs<ExtArgs>>): Prisma__AssessmentResponseClient<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many AssessmentResponses.
     * @param {AssessmentResponseCreateManyArgs} args - Arguments to create many AssessmentResponses.
     * @example
     * // Create many AssessmentResponses
     * const assessmentResponse = await prisma.assessmentResponse.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssessmentResponseCreateManyArgs>(args?: SelectSubset<T, AssessmentResponseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AssessmentResponses and returns the data saved in the database.
     * @param {AssessmentResponseCreateManyAndReturnArgs} args - Arguments to create many AssessmentResponses.
     * @example
     * // Create many AssessmentResponses
     * const assessmentResponse = await prisma.assessmentResponse.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AssessmentResponses and only return the `id`
     * const assessmentResponseWithIdOnly = await prisma.assessmentResponse.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssessmentResponseCreateManyAndReturnArgs>(args?: SelectSubset<T, AssessmentResponseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a AssessmentResponse.
     * @param {AssessmentResponseDeleteArgs} args - Arguments to delete one AssessmentResponse.
     * @example
     * // Delete one AssessmentResponse
     * const AssessmentResponse = await prisma.assessmentResponse.delete({
     *   where: {
     *     // ... filter to delete one AssessmentResponse
     *   }
     * })
     * 
     */
    delete<T extends AssessmentResponseDeleteArgs>(args: SelectSubset<T, AssessmentResponseDeleteArgs<ExtArgs>>): Prisma__AssessmentResponseClient<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one AssessmentResponse.
     * @param {AssessmentResponseUpdateArgs} args - Arguments to update one AssessmentResponse.
     * @example
     * // Update one AssessmentResponse
     * const assessmentResponse = await prisma.assessmentResponse.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssessmentResponseUpdateArgs>(args: SelectSubset<T, AssessmentResponseUpdateArgs<ExtArgs>>): Prisma__AssessmentResponseClient<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more AssessmentResponses.
     * @param {AssessmentResponseDeleteManyArgs} args - Arguments to filter AssessmentResponses to delete.
     * @example
     * // Delete a few AssessmentResponses
     * const { count } = await prisma.assessmentResponse.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssessmentResponseDeleteManyArgs>(args?: SelectSubset<T, AssessmentResponseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssessmentResponses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentResponseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssessmentResponses
     * const assessmentResponse = await prisma.assessmentResponse.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssessmentResponseUpdateManyArgs>(args: SelectSubset<T, AssessmentResponseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssessmentResponses and returns the data updated in the database.
     * @param {AssessmentResponseUpdateManyAndReturnArgs} args - Arguments to update many AssessmentResponses.
     * @example
     * // Update many AssessmentResponses
     * const assessmentResponse = await prisma.assessmentResponse.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AssessmentResponses and only return the `id`
     * const assessmentResponseWithIdOnly = await prisma.assessmentResponse.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssessmentResponseUpdateManyAndReturnArgs>(args: SelectSubset<T, AssessmentResponseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one AssessmentResponse.
     * @param {AssessmentResponseUpsertArgs} args - Arguments to update or create a AssessmentResponse.
     * @example
     * // Update or create a AssessmentResponse
     * const assessmentResponse = await prisma.assessmentResponse.upsert({
     *   create: {
     *     // ... data to create a AssessmentResponse
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssessmentResponse we want to update
     *   }
     * })
     */
    upsert<T extends AssessmentResponseUpsertArgs>(args: SelectSubset<T, AssessmentResponseUpsertArgs<ExtArgs>>): Prisma__AssessmentResponseClient<$Result.GetResult<Prisma.$AssessmentResponsePayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of AssessmentResponses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentResponseCountArgs} args - Arguments to filter AssessmentResponses to count.
     * @example
     * // Count the number of AssessmentResponses
     * const count = await prisma.assessmentResponse.count({
     *   where: {
     *     // ... the filter for the AssessmentResponses we want to count
     *   }
     * })
    **/
    count<T extends AssessmentResponseCountArgs>(
      args?: Subset<T, AssessmentResponseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssessmentResponseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssessmentResponse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentResponseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AssessmentResponseAggregateArgs>(args: Subset<T, AssessmentResponseAggregateArgs>): Prisma.PrismaPromise<GetAssessmentResponseAggregateType<T>>

    /**
     * Group by AssessmentResponse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentResponseGroupByArgs} args - Group by arguments.
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
      T extends AssessmentResponseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssessmentResponseGroupByArgs['orderBy'] }
        : { orderBy?: AssessmentResponseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AssessmentResponseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssessmentResponseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssessmentResponse model
   */
  readonly fields: AssessmentResponseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssessmentResponse.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssessmentResponseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assessment<T extends AssessmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AssessmentDefaultArgs<ExtArgs>>): Prisma__AssessmentClient<$Result.GetResult<Prisma.$AssessmentPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
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
   * Fields of the AssessmentResponse model
   */ 
  interface AssessmentResponseFieldRefs {
    readonly id: FieldRef<"AssessmentResponse", 'String'>
    readonly assessmentId: FieldRef<"AssessmentResponse", 'String'>
    readonly pillarId: FieldRef<"AssessmentResponse", 'Int'>
    readonly capabilityId: FieldRef<"AssessmentResponse", 'String'>
    readonly capabilityName: FieldRef<"AssessmentResponse", 'String'>
    readonly questionId: FieldRef<"AssessmentResponse", 'String'>
    readonly questionText: FieldRef<"AssessmentResponse", 'String'>
    readonly answer: FieldRef<"AssessmentResponse", 'String'>
    readonly recommendation: FieldRef<"AssessmentResponse", 'String'>
    readonly whyItMatters: FieldRef<"AssessmentResponse", 'String'>
    readonly quickWin: FieldRef<"AssessmentResponse", 'String'>
    readonly supportAvailable: FieldRef<"AssessmentResponse", 'String'>
    readonly priority: FieldRef<"AssessmentResponse", 'String'>
    readonly updatedAt: FieldRef<"AssessmentResponse", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AssessmentResponse findUnique
   */
  export type AssessmentResponseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * Filter, which AssessmentResponse to fetch.
     */
    where: AssessmentResponseWhereUniqueInput
  }

  /**
   * AssessmentResponse findUniqueOrThrow
   */
  export type AssessmentResponseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * Filter, which AssessmentResponse to fetch.
     */
    where: AssessmentResponseWhereUniqueInput
  }

  /**
   * AssessmentResponse findFirst
   */
  export type AssessmentResponseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * Filter, which AssessmentResponse to fetch.
     */
    where?: AssessmentResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssessmentResponses to fetch.
     */
    orderBy?: AssessmentResponseOrderByWithRelationInput | AssessmentResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssessmentResponses.
     */
    cursor?: AssessmentResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssessmentResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssessmentResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssessmentResponses.
     */
    distinct?: AssessmentResponseScalarFieldEnum | AssessmentResponseScalarFieldEnum[]
  }

  /**
   * AssessmentResponse findFirstOrThrow
   */
  export type AssessmentResponseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * Filter, which AssessmentResponse to fetch.
     */
    where?: AssessmentResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssessmentResponses to fetch.
     */
    orderBy?: AssessmentResponseOrderByWithRelationInput | AssessmentResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssessmentResponses.
     */
    cursor?: AssessmentResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssessmentResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssessmentResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssessmentResponses.
     */
    distinct?: AssessmentResponseScalarFieldEnum | AssessmentResponseScalarFieldEnum[]
  }

  /**
   * AssessmentResponse findMany
   */
  export type AssessmentResponseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * Filter, which AssessmentResponses to fetch.
     */
    where?: AssessmentResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssessmentResponses to fetch.
     */
    orderBy?: AssessmentResponseOrderByWithRelationInput | AssessmentResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssessmentResponses.
     */
    cursor?: AssessmentResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssessmentResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssessmentResponses.
     */
    skip?: number
    distinct?: AssessmentResponseScalarFieldEnum | AssessmentResponseScalarFieldEnum[]
  }

  /**
   * AssessmentResponse create
   */
  export type AssessmentResponseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * The data needed to create a AssessmentResponse.
     */
    data: XOR<AssessmentResponseCreateInput, AssessmentResponseUncheckedCreateInput>
  }

  /**
   * AssessmentResponse createMany
   */
  export type AssessmentResponseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssessmentResponses.
     */
    data: AssessmentResponseCreateManyInput | AssessmentResponseCreateManyInput[]
  }

  /**
   * AssessmentResponse createManyAndReturn
   */
  export type AssessmentResponseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * The data used to create many AssessmentResponses.
     */
    data: AssessmentResponseCreateManyInput | AssessmentResponseCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AssessmentResponse update
   */
  export type AssessmentResponseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * The data needed to update a AssessmentResponse.
     */
    data: XOR<AssessmentResponseUpdateInput, AssessmentResponseUncheckedUpdateInput>
    /**
     * Choose, which AssessmentResponse to update.
     */
    where: AssessmentResponseWhereUniqueInput
  }

  /**
   * AssessmentResponse updateMany
   */
  export type AssessmentResponseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssessmentResponses.
     */
    data: XOR<AssessmentResponseUpdateManyMutationInput, AssessmentResponseUncheckedUpdateManyInput>
    /**
     * Filter which AssessmentResponses to update
     */
    where?: AssessmentResponseWhereInput
    /**
     * Limit how many AssessmentResponses to update.
     */
    limit?: number
  }

  /**
   * AssessmentResponse updateManyAndReturn
   */
  export type AssessmentResponseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * The data used to update AssessmentResponses.
     */
    data: XOR<AssessmentResponseUpdateManyMutationInput, AssessmentResponseUncheckedUpdateManyInput>
    /**
     * Filter which AssessmentResponses to update
     */
    where?: AssessmentResponseWhereInput
    /**
     * Limit how many AssessmentResponses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AssessmentResponse upsert
   */
  export type AssessmentResponseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * The filter to search for the AssessmentResponse to update in case it exists.
     */
    where: AssessmentResponseWhereUniqueInput
    /**
     * In case the AssessmentResponse found by the `where` argument doesn't exist, create a new AssessmentResponse with this data.
     */
    create: XOR<AssessmentResponseCreateInput, AssessmentResponseUncheckedCreateInput>
    /**
     * In case the AssessmentResponse was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssessmentResponseUpdateInput, AssessmentResponseUncheckedUpdateInput>
  }

  /**
   * AssessmentResponse delete
   */
  export type AssessmentResponseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
    /**
     * Filter which AssessmentResponse to delete.
     */
    where: AssessmentResponseWhereUniqueInput
  }

  /**
   * AssessmentResponse deleteMany
   */
  export type AssessmentResponseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssessmentResponses to delete
     */
    where?: AssessmentResponseWhereInput
    /**
     * Limit how many AssessmentResponses to delete.
     */
    limit?: number
  }

  /**
   * AssessmentResponse without action
   */
  export type AssessmentResponseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessmentResponse
     */
    select?: AssessmentResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssessmentResponse
     */
    omit?: AssessmentResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentResponseInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    phone: 'phone',
    farmName: 'farmName',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const FarmerProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobTitle: 'jobTitle',
    valueChain: 'valueChain',
    experienceYears: 'experienceYears',
    businessHistory: 'businessHistory',
    educationLevel: 'educationLevel',
    education: 'education',
    otherEducation: 'otherEducation',
    updatedAt: 'updatedAt'
  };

  export type FarmerProfileScalarFieldEnum = (typeof FarmerProfileScalarFieldEnum)[keyof typeof FarmerProfileScalarFieldEnum]


  export const FarmManagementScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    mgmtAbility: 'mgmtAbility',
    operationsResponsible: 'operationsResponsible',
    opsResponsibility: 'opsResponsibility',
    operators: 'operators',
    otherOperator: 'otherOperator',
    desiredInvolvement: 'desiredInvolvement',
    updatedAt: 'updatedAt'
  };

  export type FarmManagementScalarFieldEnum = (typeof FarmManagementScalarFieldEnum)[keyof typeof FarmManagementScalarFieldEnum]


  export const OperatingStyleScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    decisionStyle: 'decisionStyle',
    failureResponse: 'failureResponse',
    obstacles: 'obstacles',
    otherObstacle: 'otherObstacle',
    guidancePreference: 'guidancePreference',
    trackingFrequency: 'trackingFrequency',
    updatePreferences: 'updatePreferences',
    updatePreference: 'updatePreference',
    communicationChannels: 'communicationChannels',
    updatedAt: 'updatedAt'
  };

  export type OperatingStyleScalarFieldEnum = (typeof OperatingStyleScalarFieldEnum)[keyof typeof OperatingStyleScalarFieldEnum]


  export const DigitalPlatformScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    supportReasons: 'supportReasons',
    otherSupportReason: 'otherSupportReason',
    remoteConfidence: 'remoteConfidence',
    remoteComfort: 'remoteComfort',
    recordKeeping: 'recordKeeping',
    physicalAudits: 'physicalAudits',
    additionalNotes: 'additionalNotes',
    updatedAt: 'updatedAt'
  };

  export type DigitalPlatformScalarFieldEnum = (typeof DigitalPlatformScalarFieldEnum)[keyof typeof DigitalPlatformScalarFieldEnum]


  export const AspirationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    twelveMonthSuccess: 'twelveMonthSuccess',
    greatestImpactSupport: 'greatestImpactSupport',
    marketInsight: 'marketInsight',
    threeToFiveYearRole: 'threeToFiveYearRole',
    managerResponsibilities: 'managerResponsibilities',
    fmResponsibility: 'fmResponsibility',
    handoverResponsibilities: 'handoverResponsibilities',
    personallyApprovedDecisions: 'personallyApprovedDecisions',
    twentyFiveYearVision: 'twentyFiveYearVision',
    updatedAt: 'updatedAt'
  };

  export type AspirationScalarFieldEnum = (typeof AspirationScalarFieldEnum)[keyof typeof AspirationScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    planType: 'planType',
    amount: 'amount',
    currency: 'currency',
    paymentMethod: 'paymentMethod',
    phoneNumber: 'phoneNumber',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const AssessmentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    overallScore: 'overallScore',
    maturityLevel: 'maturityLevel',
    pillarScores: 'pillarScores',
    radarData: 'radarData',
    priorityAreas: 'priorityAreas',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AssessmentScalarFieldEnum = (typeof AssessmentScalarFieldEnum)[keyof typeof AssessmentScalarFieldEnum]


  export const PillarAssessmentScalarFieldEnum: {
    id: 'id',
    assessmentId: 'assessmentId',
    pillarId: 'pillarId',
    pillarName: 'pillarName',
    score: 'score',
    yesCount: 'yesCount',
    noCount: 'noCount',
    totalQuestions: 'totalQuestions',
    maturityLevel: 'maturityLevel',
    capabilityScores: 'capabilityScores',
    isCompleted: 'isCompleted',
    completedAt: 'completedAt',
    updatedAt: 'updatedAt'
  };

  export type PillarAssessmentScalarFieldEnum = (typeof PillarAssessmentScalarFieldEnum)[keyof typeof PillarAssessmentScalarFieldEnum]


  export const AssessmentResponseScalarFieldEnum: {
    id: 'id',
    assessmentId: 'assessmentId',
    pillarId: 'pillarId',
    capabilityId: 'capabilityId',
    capabilityName: 'capabilityName',
    questionId: 'questionId',
    questionText: 'questionText',
    answer: 'answer',
    recommendation: 'recommendation',
    whyItMatters: 'whyItMatters',
    quickWin: 'quickWin',
    supportAvailable: 'supportAvailable',
    priority: 'priority',
    updatedAt: 'updatedAt'
  };

  export type AssessmentResponseScalarFieldEnum = (typeof AssessmentResponseScalarFieldEnum)[keyof typeof AssessmentResponseScalarFieldEnum]


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


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    farmName?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    farmerProfile?: XOR<FarmerProfileNullableScalarRelationFilter, FarmerProfileWhereInput> | null
    farmManagement?: XOR<FarmManagementNullableScalarRelationFilter, FarmManagementWhereInput> | null
    operatingStyle?: XOR<OperatingStyleNullableScalarRelationFilter, OperatingStyleWhereInput> | null
    digitalPlatform?: XOR<DigitalPlatformNullableScalarRelationFilter, DigitalPlatformWhereInput> | null
    aspiration?: XOR<AspirationNullableScalarRelationFilter, AspirationWhereInput> | null
    orders?: OrderListRelationFilter
    assessments?: AssessmentListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    phone?: SortOrderInput | SortOrder
    farmName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    farmerProfile?: FarmerProfileOrderByWithRelationInput
    farmManagement?: FarmManagementOrderByWithRelationInput
    operatingStyle?: OperatingStyleOrderByWithRelationInput
    digitalPlatform?: DigitalPlatformOrderByWithRelationInput
    aspiration?: AspirationOrderByWithRelationInput
    orders?: OrderOrderByRelationAggregateInput
    assessments?: AssessmentOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    farmName?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    farmerProfile?: XOR<FarmerProfileNullableScalarRelationFilter, FarmerProfileWhereInput> | null
    farmManagement?: XOR<FarmManagementNullableScalarRelationFilter, FarmManagementWhereInput> | null
    operatingStyle?: XOR<OperatingStyleNullableScalarRelationFilter, OperatingStyleWhereInput> | null
    digitalPlatform?: XOR<DigitalPlatformNullableScalarRelationFilter, DigitalPlatformWhereInput> | null
    aspiration?: XOR<AspirationNullableScalarRelationFilter, AspirationWhereInput> | null
    orders?: OrderListRelationFilter
    assessments?: AssessmentListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    phone?: SortOrderInput | SortOrder
    farmName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    farmName?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type FarmerProfileWhereInput = {
    AND?: FarmerProfileWhereInput | FarmerProfileWhereInput[]
    OR?: FarmerProfileWhereInput[]
    NOT?: FarmerProfileWhereInput | FarmerProfileWhereInput[]
    id?: StringFilter<"FarmerProfile"> | string
    userId?: StringFilter<"FarmerProfile"> | string
    jobTitle?: StringNullableFilter<"FarmerProfile"> | string | null
    valueChain?: StringNullableFilter<"FarmerProfile"> | string | null
    experienceYears?: StringNullableFilter<"FarmerProfile"> | string | null
    businessHistory?: StringNullableFilter<"FarmerProfile"> | string | null
    educationLevel?: StringNullableFilter<"FarmerProfile"> | string | null
    education?: StringNullableFilter<"FarmerProfile"> | string | null
    otherEducation?: StringNullableFilter<"FarmerProfile"> | string | null
    updatedAt?: DateTimeFilter<"FarmerProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FarmerProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrderInput | SortOrder
    valueChain?: SortOrderInput | SortOrder
    experienceYears?: SortOrderInput | SortOrder
    businessHistory?: SortOrderInput | SortOrder
    educationLevel?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    otherEducation?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type FarmerProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: FarmerProfileWhereInput | FarmerProfileWhereInput[]
    OR?: FarmerProfileWhereInput[]
    NOT?: FarmerProfileWhereInput | FarmerProfileWhereInput[]
    jobTitle?: StringNullableFilter<"FarmerProfile"> | string | null
    valueChain?: StringNullableFilter<"FarmerProfile"> | string | null
    experienceYears?: StringNullableFilter<"FarmerProfile"> | string | null
    businessHistory?: StringNullableFilter<"FarmerProfile"> | string | null
    educationLevel?: StringNullableFilter<"FarmerProfile"> | string | null
    education?: StringNullableFilter<"FarmerProfile"> | string | null
    otherEducation?: StringNullableFilter<"FarmerProfile"> | string | null
    updatedAt?: DateTimeFilter<"FarmerProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type FarmerProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrderInput | SortOrder
    valueChain?: SortOrderInput | SortOrder
    experienceYears?: SortOrderInput | SortOrder
    businessHistory?: SortOrderInput | SortOrder
    educationLevel?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    otherEducation?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: FarmerProfileCountOrderByAggregateInput
    _max?: FarmerProfileMaxOrderByAggregateInput
    _min?: FarmerProfileMinOrderByAggregateInput
  }

  export type FarmerProfileScalarWhereWithAggregatesInput = {
    AND?: FarmerProfileScalarWhereWithAggregatesInput | FarmerProfileScalarWhereWithAggregatesInput[]
    OR?: FarmerProfileScalarWhereWithAggregatesInput[]
    NOT?: FarmerProfileScalarWhereWithAggregatesInput | FarmerProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FarmerProfile"> | string
    userId?: StringWithAggregatesFilter<"FarmerProfile"> | string
    jobTitle?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    valueChain?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    experienceYears?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    businessHistory?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    educationLevel?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    education?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    otherEducation?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"FarmerProfile"> | Date | string
  }

  export type FarmManagementWhereInput = {
    AND?: FarmManagementWhereInput | FarmManagementWhereInput[]
    OR?: FarmManagementWhereInput[]
    NOT?: FarmManagementWhereInput | FarmManagementWhereInput[]
    id?: StringFilter<"FarmManagement"> | string
    userId?: StringFilter<"FarmManagement"> | string
    mgmtAbility?: StringNullableFilter<"FarmManagement"> | string | null
    operationsResponsible?: StringNullableFilter<"FarmManagement"> | string | null
    opsResponsibility?: StringNullableFilter<"FarmManagement"> | string | null
    operators?: StringNullableFilter<"FarmManagement"> | string | null
    otherOperator?: StringNullableFilter<"FarmManagement"> | string | null
    desiredInvolvement?: StringNullableFilter<"FarmManagement"> | string | null
    updatedAt?: DateTimeFilter<"FarmManagement"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FarmManagementOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    mgmtAbility?: SortOrderInput | SortOrder
    operationsResponsible?: SortOrderInput | SortOrder
    opsResponsibility?: SortOrderInput | SortOrder
    operators?: SortOrderInput | SortOrder
    otherOperator?: SortOrderInput | SortOrder
    desiredInvolvement?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type FarmManagementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: FarmManagementWhereInput | FarmManagementWhereInput[]
    OR?: FarmManagementWhereInput[]
    NOT?: FarmManagementWhereInput | FarmManagementWhereInput[]
    mgmtAbility?: StringNullableFilter<"FarmManagement"> | string | null
    operationsResponsible?: StringNullableFilter<"FarmManagement"> | string | null
    opsResponsibility?: StringNullableFilter<"FarmManagement"> | string | null
    operators?: StringNullableFilter<"FarmManagement"> | string | null
    otherOperator?: StringNullableFilter<"FarmManagement"> | string | null
    desiredInvolvement?: StringNullableFilter<"FarmManagement"> | string | null
    updatedAt?: DateTimeFilter<"FarmManagement"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type FarmManagementOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    mgmtAbility?: SortOrderInput | SortOrder
    operationsResponsible?: SortOrderInput | SortOrder
    opsResponsibility?: SortOrderInput | SortOrder
    operators?: SortOrderInput | SortOrder
    otherOperator?: SortOrderInput | SortOrder
    desiredInvolvement?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: FarmManagementCountOrderByAggregateInput
    _max?: FarmManagementMaxOrderByAggregateInput
    _min?: FarmManagementMinOrderByAggregateInput
  }

  export type FarmManagementScalarWhereWithAggregatesInput = {
    AND?: FarmManagementScalarWhereWithAggregatesInput | FarmManagementScalarWhereWithAggregatesInput[]
    OR?: FarmManagementScalarWhereWithAggregatesInput[]
    NOT?: FarmManagementScalarWhereWithAggregatesInput | FarmManagementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FarmManagement"> | string
    userId?: StringWithAggregatesFilter<"FarmManagement"> | string
    mgmtAbility?: StringNullableWithAggregatesFilter<"FarmManagement"> | string | null
    operationsResponsible?: StringNullableWithAggregatesFilter<"FarmManagement"> | string | null
    opsResponsibility?: StringNullableWithAggregatesFilter<"FarmManagement"> | string | null
    operators?: StringNullableWithAggregatesFilter<"FarmManagement"> | string | null
    otherOperator?: StringNullableWithAggregatesFilter<"FarmManagement"> | string | null
    desiredInvolvement?: StringNullableWithAggregatesFilter<"FarmManagement"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"FarmManagement"> | Date | string
  }

  export type OperatingStyleWhereInput = {
    AND?: OperatingStyleWhereInput | OperatingStyleWhereInput[]
    OR?: OperatingStyleWhereInput[]
    NOT?: OperatingStyleWhereInput | OperatingStyleWhereInput[]
    id?: StringFilter<"OperatingStyle"> | string
    userId?: StringFilter<"OperatingStyle"> | string
    decisionStyle?: StringNullableFilter<"OperatingStyle"> | string | null
    failureResponse?: StringNullableFilter<"OperatingStyle"> | string | null
    obstacles?: StringNullableFilter<"OperatingStyle"> | string | null
    otherObstacle?: StringNullableFilter<"OperatingStyle"> | string | null
    guidancePreference?: StringNullableFilter<"OperatingStyle"> | string | null
    trackingFrequency?: StringNullableFilter<"OperatingStyle"> | string | null
    updatePreferences?: StringNullableFilter<"OperatingStyle"> | string | null
    updatePreference?: StringNullableFilter<"OperatingStyle"> | string | null
    communicationChannels?: StringNullableFilter<"OperatingStyle"> | string | null
    updatedAt?: DateTimeFilter<"OperatingStyle"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OperatingStyleOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    decisionStyle?: SortOrderInput | SortOrder
    failureResponse?: SortOrderInput | SortOrder
    obstacles?: SortOrderInput | SortOrder
    otherObstacle?: SortOrderInput | SortOrder
    guidancePreference?: SortOrderInput | SortOrder
    trackingFrequency?: SortOrderInput | SortOrder
    updatePreferences?: SortOrderInput | SortOrder
    updatePreference?: SortOrderInput | SortOrder
    communicationChannels?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type OperatingStyleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: OperatingStyleWhereInput | OperatingStyleWhereInput[]
    OR?: OperatingStyleWhereInput[]
    NOT?: OperatingStyleWhereInput | OperatingStyleWhereInput[]
    decisionStyle?: StringNullableFilter<"OperatingStyle"> | string | null
    failureResponse?: StringNullableFilter<"OperatingStyle"> | string | null
    obstacles?: StringNullableFilter<"OperatingStyle"> | string | null
    otherObstacle?: StringNullableFilter<"OperatingStyle"> | string | null
    guidancePreference?: StringNullableFilter<"OperatingStyle"> | string | null
    trackingFrequency?: StringNullableFilter<"OperatingStyle"> | string | null
    updatePreferences?: StringNullableFilter<"OperatingStyle"> | string | null
    updatePreference?: StringNullableFilter<"OperatingStyle"> | string | null
    communicationChannels?: StringNullableFilter<"OperatingStyle"> | string | null
    updatedAt?: DateTimeFilter<"OperatingStyle"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type OperatingStyleOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    decisionStyle?: SortOrderInput | SortOrder
    failureResponse?: SortOrderInput | SortOrder
    obstacles?: SortOrderInput | SortOrder
    otherObstacle?: SortOrderInput | SortOrder
    guidancePreference?: SortOrderInput | SortOrder
    trackingFrequency?: SortOrderInput | SortOrder
    updatePreferences?: SortOrderInput | SortOrder
    updatePreference?: SortOrderInput | SortOrder
    communicationChannels?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: OperatingStyleCountOrderByAggregateInput
    _max?: OperatingStyleMaxOrderByAggregateInput
    _min?: OperatingStyleMinOrderByAggregateInput
  }

  export type OperatingStyleScalarWhereWithAggregatesInput = {
    AND?: OperatingStyleScalarWhereWithAggregatesInput | OperatingStyleScalarWhereWithAggregatesInput[]
    OR?: OperatingStyleScalarWhereWithAggregatesInput[]
    NOT?: OperatingStyleScalarWhereWithAggregatesInput | OperatingStyleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OperatingStyle"> | string
    userId?: StringWithAggregatesFilter<"OperatingStyle"> | string
    decisionStyle?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    failureResponse?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    obstacles?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    otherObstacle?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    guidancePreference?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    trackingFrequency?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    updatePreferences?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    updatePreference?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    communicationChannels?: StringNullableWithAggregatesFilter<"OperatingStyle"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"OperatingStyle"> | Date | string
  }

  export type DigitalPlatformWhereInput = {
    AND?: DigitalPlatformWhereInput | DigitalPlatformWhereInput[]
    OR?: DigitalPlatformWhereInput[]
    NOT?: DigitalPlatformWhereInput | DigitalPlatformWhereInput[]
    id?: StringFilter<"DigitalPlatform"> | string
    userId?: StringFilter<"DigitalPlatform"> | string
    supportReasons?: StringNullableFilter<"DigitalPlatform"> | string | null
    otherSupportReason?: StringNullableFilter<"DigitalPlatform"> | string | null
    remoteConfidence?: StringNullableFilter<"DigitalPlatform"> | string | null
    remoteComfort?: StringNullableFilter<"DigitalPlatform"> | string | null
    recordKeeping?: StringNullableFilter<"DigitalPlatform"> | string | null
    physicalAudits?: StringNullableFilter<"DigitalPlatform"> | string | null
    additionalNotes?: StringNullableFilter<"DigitalPlatform"> | string | null
    updatedAt?: DateTimeFilter<"DigitalPlatform"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DigitalPlatformOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    supportReasons?: SortOrderInput | SortOrder
    otherSupportReason?: SortOrderInput | SortOrder
    remoteConfidence?: SortOrderInput | SortOrder
    remoteComfort?: SortOrderInput | SortOrder
    recordKeeping?: SortOrderInput | SortOrder
    physicalAudits?: SortOrderInput | SortOrder
    additionalNotes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DigitalPlatformWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: DigitalPlatformWhereInput | DigitalPlatformWhereInput[]
    OR?: DigitalPlatformWhereInput[]
    NOT?: DigitalPlatformWhereInput | DigitalPlatformWhereInput[]
    supportReasons?: StringNullableFilter<"DigitalPlatform"> | string | null
    otherSupportReason?: StringNullableFilter<"DigitalPlatform"> | string | null
    remoteConfidence?: StringNullableFilter<"DigitalPlatform"> | string | null
    remoteComfort?: StringNullableFilter<"DigitalPlatform"> | string | null
    recordKeeping?: StringNullableFilter<"DigitalPlatform"> | string | null
    physicalAudits?: StringNullableFilter<"DigitalPlatform"> | string | null
    additionalNotes?: StringNullableFilter<"DigitalPlatform"> | string | null
    updatedAt?: DateTimeFilter<"DigitalPlatform"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type DigitalPlatformOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    supportReasons?: SortOrderInput | SortOrder
    otherSupportReason?: SortOrderInput | SortOrder
    remoteConfidence?: SortOrderInput | SortOrder
    remoteComfort?: SortOrderInput | SortOrder
    recordKeeping?: SortOrderInput | SortOrder
    physicalAudits?: SortOrderInput | SortOrder
    additionalNotes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: DigitalPlatformCountOrderByAggregateInput
    _max?: DigitalPlatformMaxOrderByAggregateInput
    _min?: DigitalPlatformMinOrderByAggregateInput
  }

  export type DigitalPlatformScalarWhereWithAggregatesInput = {
    AND?: DigitalPlatformScalarWhereWithAggregatesInput | DigitalPlatformScalarWhereWithAggregatesInput[]
    OR?: DigitalPlatformScalarWhereWithAggregatesInput[]
    NOT?: DigitalPlatformScalarWhereWithAggregatesInput | DigitalPlatformScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DigitalPlatform"> | string
    userId?: StringWithAggregatesFilter<"DigitalPlatform"> | string
    supportReasons?: StringNullableWithAggregatesFilter<"DigitalPlatform"> | string | null
    otherSupportReason?: StringNullableWithAggregatesFilter<"DigitalPlatform"> | string | null
    remoteConfidence?: StringNullableWithAggregatesFilter<"DigitalPlatform"> | string | null
    remoteComfort?: StringNullableWithAggregatesFilter<"DigitalPlatform"> | string | null
    recordKeeping?: StringNullableWithAggregatesFilter<"DigitalPlatform"> | string | null
    physicalAudits?: StringNullableWithAggregatesFilter<"DigitalPlatform"> | string | null
    additionalNotes?: StringNullableWithAggregatesFilter<"DigitalPlatform"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"DigitalPlatform"> | Date | string
  }

  export type AspirationWhereInput = {
    AND?: AspirationWhereInput | AspirationWhereInput[]
    OR?: AspirationWhereInput[]
    NOT?: AspirationWhereInput | AspirationWhereInput[]
    id?: StringFilter<"Aspiration"> | string
    userId?: StringFilter<"Aspiration"> | string
    twelveMonthSuccess?: StringNullableFilter<"Aspiration"> | string | null
    greatestImpactSupport?: StringNullableFilter<"Aspiration"> | string | null
    marketInsight?: StringNullableFilter<"Aspiration"> | string | null
    threeToFiveYearRole?: StringNullableFilter<"Aspiration"> | string | null
    managerResponsibilities?: StringNullableFilter<"Aspiration"> | string | null
    fmResponsibility?: StringNullableFilter<"Aspiration"> | string | null
    handoverResponsibilities?: StringNullableFilter<"Aspiration"> | string | null
    personallyApprovedDecisions?: StringNullableFilter<"Aspiration"> | string | null
    twentyFiveYearVision?: StringNullableFilter<"Aspiration"> | string | null
    updatedAt?: DateTimeFilter<"Aspiration"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AspirationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    twelveMonthSuccess?: SortOrderInput | SortOrder
    greatestImpactSupport?: SortOrderInput | SortOrder
    marketInsight?: SortOrderInput | SortOrder
    threeToFiveYearRole?: SortOrderInput | SortOrder
    managerResponsibilities?: SortOrderInput | SortOrder
    fmResponsibility?: SortOrderInput | SortOrder
    handoverResponsibilities?: SortOrderInput | SortOrder
    personallyApprovedDecisions?: SortOrderInput | SortOrder
    twentyFiveYearVision?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AspirationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: AspirationWhereInput | AspirationWhereInput[]
    OR?: AspirationWhereInput[]
    NOT?: AspirationWhereInput | AspirationWhereInput[]
    twelveMonthSuccess?: StringNullableFilter<"Aspiration"> | string | null
    greatestImpactSupport?: StringNullableFilter<"Aspiration"> | string | null
    marketInsight?: StringNullableFilter<"Aspiration"> | string | null
    threeToFiveYearRole?: StringNullableFilter<"Aspiration"> | string | null
    managerResponsibilities?: StringNullableFilter<"Aspiration"> | string | null
    fmResponsibility?: StringNullableFilter<"Aspiration"> | string | null
    handoverResponsibilities?: StringNullableFilter<"Aspiration"> | string | null
    personallyApprovedDecisions?: StringNullableFilter<"Aspiration"> | string | null
    twentyFiveYearVision?: StringNullableFilter<"Aspiration"> | string | null
    updatedAt?: DateTimeFilter<"Aspiration"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type AspirationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    twelveMonthSuccess?: SortOrderInput | SortOrder
    greatestImpactSupport?: SortOrderInput | SortOrder
    marketInsight?: SortOrderInput | SortOrder
    threeToFiveYearRole?: SortOrderInput | SortOrder
    managerResponsibilities?: SortOrderInput | SortOrder
    fmResponsibility?: SortOrderInput | SortOrder
    handoverResponsibilities?: SortOrderInput | SortOrder
    personallyApprovedDecisions?: SortOrderInput | SortOrder
    twentyFiveYearVision?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: AspirationCountOrderByAggregateInput
    _max?: AspirationMaxOrderByAggregateInput
    _min?: AspirationMinOrderByAggregateInput
  }

  export type AspirationScalarWhereWithAggregatesInput = {
    AND?: AspirationScalarWhereWithAggregatesInput | AspirationScalarWhereWithAggregatesInput[]
    OR?: AspirationScalarWhereWithAggregatesInput[]
    NOT?: AspirationScalarWhereWithAggregatesInput | AspirationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Aspiration"> | string
    userId?: StringWithAggregatesFilter<"Aspiration"> | string
    twelveMonthSuccess?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    greatestImpactSupport?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    marketInsight?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    threeToFiveYearRole?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    managerResponsibilities?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    fmResponsibility?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    handoverResponsibilities?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    personallyApprovedDecisions?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    twentyFiveYearVision?: StringNullableWithAggregatesFilter<"Aspiration"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"Aspiration"> | Date | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    userId?: StringFilter<"Order"> | string
    planType?: StringFilter<"Order"> | string
    amount?: FloatFilter<"Order"> | number
    currency?: StringFilter<"Order"> | string
    paymentMethod?: StringFilter<"Order"> | string
    phoneNumber?: StringNullableFilter<"Order"> | string | null
    status?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    planType?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    userId?: StringFilter<"Order"> | string
    planType?: StringFilter<"Order"> | string
    amount?: FloatFilter<"Order"> | number
    currency?: StringFilter<"Order"> | string
    paymentMethod?: StringFilter<"Order"> | string
    phoneNumber?: StringNullableFilter<"Order"> | string | null
    status?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    planType?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    userId?: StringWithAggregatesFilter<"Order"> | string
    planType?: StringWithAggregatesFilter<"Order"> | string
    amount?: FloatWithAggregatesFilter<"Order"> | number
    currency?: StringWithAggregatesFilter<"Order"> | string
    paymentMethod?: StringWithAggregatesFilter<"Order"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"Order"> | string | null
    status?: StringWithAggregatesFilter<"Order"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
  }

  export type AssessmentWhereInput = {
    AND?: AssessmentWhereInput | AssessmentWhereInput[]
    OR?: AssessmentWhereInput[]
    NOT?: AssessmentWhereInput | AssessmentWhereInput[]
    id?: StringFilter<"Assessment"> | string
    userId?: StringFilter<"Assessment"> | string
    overallScore?: IntFilter<"Assessment"> | number
    maturityLevel?: StringFilter<"Assessment"> | string
    pillarScores?: StringFilter<"Assessment"> | string
    radarData?: StringFilter<"Assessment"> | string
    priorityAreas?: StringFilter<"Assessment"> | string
    status?: StringFilter<"Assessment"> | string
    createdAt?: DateTimeFilter<"Assessment"> | Date | string
    updatedAt?: DateTimeFilter<"Assessment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    pillarAssessments?: PillarAssessmentListRelationFilter
    assessmentResponses?: AssessmentResponseListRelationFilter
  }

  export type AssessmentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    overallScore?: SortOrder
    maturityLevel?: SortOrder
    pillarScores?: SortOrder
    radarData?: SortOrder
    priorityAreas?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    pillarAssessments?: PillarAssessmentOrderByRelationAggregateInput
    assessmentResponses?: AssessmentResponseOrderByRelationAggregateInput
  }

  export type AssessmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AssessmentWhereInput | AssessmentWhereInput[]
    OR?: AssessmentWhereInput[]
    NOT?: AssessmentWhereInput | AssessmentWhereInput[]
    userId?: StringFilter<"Assessment"> | string
    overallScore?: IntFilter<"Assessment"> | number
    maturityLevel?: StringFilter<"Assessment"> | string
    pillarScores?: StringFilter<"Assessment"> | string
    radarData?: StringFilter<"Assessment"> | string
    priorityAreas?: StringFilter<"Assessment"> | string
    status?: StringFilter<"Assessment"> | string
    createdAt?: DateTimeFilter<"Assessment"> | Date | string
    updatedAt?: DateTimeFilter<"Assessment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    pillarAssessments?: PillarAssessmentListRelationFilter
    assessmentResponses?: AssessmentResponseListRelationFilter
  }, "id">

  export type AssessmentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    overallScore?: SortOrder
    maturityLevel?: SortOrder
    pillarScores?: SortOrder
    radarData?: SortOrder
    priorityAreas?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AssessmentCountOrderByAggregateInput
    _avg?: AssessmentAvgOrderByAggregateInput
    _max?: AssessmentMaxOrderByAggregateInput
    _min?: AssessmentMinOrderByAggregateInput
    _sum?: AssessmentSumOrderByAggregateInput
  }

  export type AssessmentScalarWhereWithAggregatesInput = {
    AND?: AssessmentScalarWhereWithAggregatesInput | AssessmentScalarWhereWithAggregatesInput[]
    OR?: AssessmentScalarWhereWithAggregatesInput[]
    NOT?: AssessmentScalarWhereWithAggregatesInput | AssessmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Assessment"> | string
    userId?: StringWithAggregatesFilter<"Assessment"> | string
    overallScore?: IntWithAggregatesFilter<"Assessment"> | number
    maturityLevel?: StringWithAggregatesFilter<"Assessment"> | string
    pillarScores?: StringWithAggregatesFilter<"Assessment"> | string
    radarData?: StringWithAggregatesFilter<"Assessment"> | string
    priorityAreas?: StringWithAggregatesFilter<"Assessment"> | string
    status?: StringWithAggregatesFilter<"Assessment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Assessment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Assessment"> | Date | string
  }

  export type PillarAssessmentWhereInput = {
    AND?: PillarAssessmentWhereInput | PillarAssessmentWhereInput[]
    OR?: PillarAssessmentWhereInput[]
    NOT?: PillarAssessmentWhereInput | PillarAssessmentWhereInput[]
    id?: StringFilter<"PillarAssessment"> | string
    assessmentId?: StringFilter<"PillarAssessment"> | string
    pillarId?: IntFilter<"PillarAssessment"> | number
    pillarName?: StringFilter<"PillarAssessment"> | string
    score?: FloatFilter<"PillarAssessment"> | number
    yesCount?: IntFilter<"PillarAssessment"> | number
    noCount?: IntFilter<"PillarAssessment"> | number
    totalQuestions?: IntFilter<"PillarAssessment"> | number
    maturityLevel?: StringFilter<"PillarAssessment"> | string
    capabilityScores?: StringFilter<"PillarAssessment"> | string
    isCompleted?: BoolFilter<"PillarAssessment"> | boolean
    completedAt?: DateTimeNullableFilter<"PillarAssessment"> | Date | string | null
    updatedAt?: DateTimeFilter<"PillarAssessment"> | Date | string
    assessment?: XOR<AssessmentScalarRelationFilter, AssessmentWhereInput>
  }

  export type PillarAssessmentOrderByWithRelationInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    pillarName?: SortOrder
    score?: SortOrder
    yesCount?: SortOrder
    noCount?: SortOrder
    totalQuestions?: SortOrder
    maturityLevel?: SortOrder
    capabilityScores?: SortOrder
    isCompleted?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    assessment?: AssessmentOrderByWithRelationInput
  }

  export type PillarAssessmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    assessmentId_pillarId?: PillarAssessmentAssessmentIdPillarIdCompoundUniqueInput
    AND?: PillarAssessmentWhereInput | PillarAssessmentWhereInput[]
    OR?: PillarAssessmentWhereInput[]
    NOT?: PillarAssessmentWhereInput | PillarAssessmentWhereInput[]
    assessmentId?: StringFilter<"PillarAssessment"> | string
    pillarId?: IntFilter<"PillarAssessment"> | number
    pillarName?: StringFilter<"PillarAssessment"> | string
    score?: FloatFilter<"PillarAssessment"> | number
    yesCount?: IntFilter<"PillarAssessment"> | number
    noCount?: IntFilter<"PillarAssessment"> | number
    totalQuestions?: IntFilter<"PillarAssessment"> | number
    maturityLevel?: StringFilter<"PillarAssessment"> | string
    capabilityScores?: StringFilter<"PillarAssessment"> | string
    isCompleted?: BoolFilter<"PillarAssessment"> | boolean
    completedAt?: DateTimeNullableFilter<"PillarAssessment"> | Date | string | null
    updatedAt?: DateTimeFilter<"PillarAssessment"> | Date | string
    assessment?: XOR<AssessmentScalarRelationFilter, AssessmentWhereInput>
  }, "id" | "assessmentId_pillarId">

  export type PillarAssessmentOrderByWithAggregationInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    pillarName?: SortOrder
    score?: SortOrder
    yesCount?: SortOrder
    noCount?: SortOrder
    totalQuestions?: SortOrder
    maturityLevel?: SortOrder
    capabilityScores?: SortOrder
    isCompleted?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: PillarAssessmentCountOrderByAggregateInput
    _avg?: PillarAssessmentAvgOrderByAggregateInput
    _max?: PillarAssessmentMaxOrderByAggregateInput
    _min?: PillarAssessmentMinOrderByAggregateInput
    _sum?: PillarAssessmentSumOrderByAggregateInput
  }

  export type PillarAssessmentScalarWhereWithAggregatesInput = {
    AND?: PillarAssessmentScalarWhereWithAggregatesInput | PillarAssessmentScalarWhereWithAggregatesInput[]
    OR?: PillarAssessmentScalarWhereWithAggregatesInput[]
    NOT?: PillarAssessmentScalarWhereWithAggregatesInput | PillarAssessmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PillarAssessment"> | string
    assessmentId?: StringWithAggregatesFilter<"PillarAssessment"> | string
    pillarId?: IntWithAggregatesFilter<"PillarAssessment"> | number
    pillarName?: StringWithAggregatesFilter<"PillarAssessment"> | string
    score?: FloatWithAggregatesFilter<"PillarAssessment"> | number
    yesCount?: IntWithAggregatesFilter<"PillarAssessment"> | number
    noCount?: IntWithAggregatesFilter<"PillarAssessment"> | number
    totalQuestions?: IntWithAggregatesFilter<"PillarAssessment"> | number
    maturityLevel?: StringWithAggregatesFilter<"PillarAssessment"> | string
    capabilityScores?: StringWithAggregatesFilter<"PillarAssessment"> | string
    isCompleted?: BoolWithAggregatesFilter<"PillarAssessment"> | boolean
    completedAt?: DateTimeNullableWithAggregatesFilter<"PillarAssessment"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"PillarAssessment"> | Date | string
  }

  export type AssessmentResponseWhereInput = {
    AND?: AssessmentResponseWhereInput | AssessmentResponseWhereInput[]
    OR?: AssessmentResponseWhereInput[]
    NOT?: AssessmentResponseWhereInput | AssessmentResponseWhereInput[]
    id?: StringFilter<"AssessmentResponse"> | string
    assessmentId?: StringFilter<"AssessmentResponse"> | string
    pillarId?: IntFilter<"AssessmentResponse"> | number
    capabilityId?: StringFilter<"AssessmentResponse"> | string
    capabilityName?: StringNullableFilter<"AssessmentResponse"> | string | null
    questionId?: StringFilter<"AssessmentResponse"> | string
    questionText?: StringFilter<"AssessmentResponse"> | string
    answer?: StringFilter<"AssessmentResponse"> | string
    recommendation?: StringNullableFilter<"AssessmentResponse"> | string | null
    whyItMatters?: StringNullableFilter<"AssessmentResponse"> | string | null
    quickWin?: StringNullableFilter<"AssessmentResponse"> | string | null
    supportAvailable?: StringNullableFilter<"AssessmentResponse"> | string | null
    priority?: StringNullableFilter<"AssessmentResponse"> | string | null
    updatedAt?: DateTimeFilter<"AssessmentResponse"> | Date | string
    assessment?: XOR<AssessmentScalarRelationFilter, AssessmentWhereInput>
  }

  export type AssessmentResponseOrderByWithRelationInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    capabilityId?: SortOrder
    capabilityName?: SortOrderInput | SortOrder
    questionId?: SortOrder
    questionText?: SortOrder
    answer?: SortOrder
    recommendation?: SortOrderInput | SortOrder
    whyItMatters?: SortOrderInput | SortOrder
    quickWin?: SortOrderInput | SortOrder
    supportAvailable?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    assessment?: AssessmentOrderByWithRelationInput
  }

  export type AssessmentResponseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    assessmentId_questionId?: AssessmentResponseAssessmentIdQuestionIdCompoundUniqueInput
    AND?: AssessmentResponseWhereInput | AssessmentResponseWhereInput[]
    OR?: AssessmentResponseWhereInput[]
    NOT?: AssessmentResponseWhereInput | AssessmentResponseWhereInput[]
    assessmentId?: StringFilter<"AssessmentResponse"> | string
    pillarId?: IntFilter<"AssessmentResponse"> | number
    capabilityId?: StringFilter<"AssessmentResponse"> | string
    capabilityName?: StringNullableFilter<"AssessmentResponse"> | string | null
    questionId?: StringFilter<"AssessmentResponse"> | string
    questionText?: StringFilter<"AssessmentResponse"> | string
    answer?: StringFilter<"AssessmentResponse"> | string
    recommendation?: StringNullableFilter<"AssessmentResponse"> | string | null
    whyItMatters?: StringNullableFilter<"AssessmentResponse"> | string | null
    quickWin?: StringNullableFilter<"AssessmentResponse"> | string | null
    supportAvailable?: StringNullableFilter<"AssessmentResponse"> | string | null
    priority?: StringNullableFilter<"AssessmentResponse"> | string | null
    updatedAt?: DateTimeFilter<"AssessmentResponse"> | Date | string
    assessment?: XOR<AssessmentScalarRelationFilter, AssessmentWhereInput>
  }, "id" | "assessmentId_questionId">

  export type AssessmentResponseOrderByWithAggregationInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    capabilityId?: SortOrder
    capabilityName?: SortOrderInput | SortOrder
    questionId?: SortOrder
    questionText?: SortOrder
    answer?: SortOrder
    recommendation?: SortOrderInput | SortOrder
    whyItMatters?: SortOrderInput | SortOrder
    quickWin?: SortOrderInput | SortOrder
    supportAvailable?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: AssessmentResponseCountOrderByAggregateInput
    _avg?: AssessmentResponseAvgOrderByAggregateInput
    _max?: AssessmentResponseMaxOrderByAggregateInput
    _min?: AssessmentResponseMinOrderByAggregateInput
    _sum?: AssessmentResponseSumOrderByAggregateInput
  }

  export type AssessmentResponseScalarWhereWithAggregatesInput = {
    AND?: AssessmentResponseScalarWhereWithAggregatesInput | AssessmentResponseScalarWhereWithAggregatesInput[]
    OR?: AssessmentResponseScalarWhereWithAggregatesInput[]
    NOT?: AssessmentResponseScalarWhereWithAggregatesInput | AssessmentResponseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssessmentResponse"> | string
    assessmentId?: StringWithAggregatesFilter<"AssessmentResponse"> | string
    pillarId?: IntWithAggregatesFilter<"AssessmentResponse"> | number
    capabilityId?: StringWithAggregatesFilter<"AssessmentResponse"> | string
    capabilityName?: StringNullableWithAggregatesFilter<"AssessmentResponse"> | string | null
    questionId?: StringWithAggregatesFilter<"AssessmentResponse"> | string
    questionText?: StringWithAggregatesFilter<"AssessmentResponse"> | string
    answer?: StringWithAggregatesFilter<"AssessmentResponse"> | string
    recommendation?: StringNullableWithAggregatesFilter<"AssessmentResponse"> | string | null
    whyItMatters?: StringNullableWithAggregatesFilter<"AssessmentResponse"> | string | null
    quickWin?: StringNullableWithAggregatesFilter<"AssessmentResponse"> | string | null
    supportAvailable?: StringNullableWithAggregatesFilter<"AssessmentResponse"> | string | null
    priority?: StringNullableWithAggregatesFilter<"AssessmentResponse"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"AssessmentResponse"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformCreateNestedOneWithoutUserInput
    aspiration?: AspirationCreateNestedOneWithoutUserInput
    orders?: OrderCreateNestedManyWithoutUserInput
    assessments?: AssessmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileUncheckedCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementUncheckedCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleUncheckedCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformUncheckedCreateNestedOneWithoutUserInput
    aspiration?: AspirationUncheckedCreateNestedOneWithoutUserInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    assessments?: AssessmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUpdateOneWithoutUserNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUncheckedUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUncheckedUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUncheckedUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUncheckedUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUncheckedUpdateOneWithoutUserNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmerProfileCreateInput = {
    id?: string
    jobTitle?: string | null
    valueChain?: string | null
    experienceYears?: string | null
    businessHistory?: string | null
    educationLevel?: string | null
    education?: string | null
    otherEducation?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutFarmerProfileInput
  }

  export type FarmerProfileUncheckedCreateInput = {
    id?: string
    userId: string
    jobTitle?: string | null
    valueChain?: string | null
    experienceYears?: string | null
    businessHistory?: string | null
    educationLevel?: string | null
    education?: string | null
    otherEducation?: string | null
    updatedAt?: Date | string
  }

  export type FarmerProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    valueChain?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYears?: NullableStringFieldUpdateOperationsInput | string | null
    businessHistory?: NullableStringFieldUpdateOperationsInput | string | null
    educationLevel?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    otherEducation?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFarmerProfileNestedInput
  }

  export type FarmerProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    valueChain?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYears?: NullableStringFieldUpdateOperationsInput | string | null
    businessHistory?: NullableStringFieldUpdateOperationsInput | string | null
    educationLevel?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    otherEducation?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmerProfileCreateManyInput = {
    id?: string
    userId: string
    jobTitle?: string | null
    valueChain?: string | null
    experienceYears?: string | null
    businessHistory?: string | null
    educationLevel?: string | null
    education?: string | null
    otherEducation?: string | null
    updatedAt?: Date | string
  }

  export type FarmerProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    valueChain?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYears?: NullableStringFieldUpdateOperationsInput | string | null
    businessHistory?: NullableStringFieldUpdateOperationsInput | string | null
    educationLevel?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    otherEducation?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmerProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    valueChain?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYears?: NullableStringFieldUpdateOperationsInput | string | null
    businessHistory?: NullableStringFieldUpdateOperationsInput | string | null
    educationLevel?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    otherEducation?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmManagementCreateInput = {
    id?: string
    mgmtAbility?: string | null
    operationsResponsible?: string | null
    opsResponsibility?: string | null
    operators?: string | null
    otherOperator?: string | null
    desiredInvolvement?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutFarmManagementInput
  }

  export type FarmManagementUncheckedCreateInput = {
    id?: string
    userId: string
    mgmtAbility?: string | null
    operationsResponsible?: string | null
    opsResponsibility?: string | null
    operators?: string | null
    otherOperator?: string | null
    desiredInvolvement?: string | null
    updatedAt?: Date | string
  }

  export type FarmManagementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mgmtAbility?: NullableStringFieldUpdateOperationsInput | string | null
    operationsResponsible?: NullableStringFieldUpdateOperationsInput | string | null
    opsResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    operators?: NullableStringFieldUpdateOperationsInput | string | null
    otherOperator?: NullableStringFieldUpdateOperationsInput | string | null
    desiredInvolvement?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFarmManagementNestedInput
  }

  export type FarmManagementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mgmtAbility?: NullableStringFieldUpdateOperationsInput | string | null
    operationsResponsible?: NullableStringFieldUpdateOperationsInput | string | null
    opsResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    operators?: NullableStringFieldUpdateOperationsInput | string | null
    otherOperator?: NullableStringFieldUpdateOperationsInput | string | null
    desiredInvolvement?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmManagementCreateManyInput = {
    id?: string
    userId: string
    mgmtAbility?: string | null
    operationsResponsible?: string | null
    opsResponsibility?: string | null
    operators?: string | null
    otherOperator?: string | null
    desiredInvolvement?: string | null
    updatedAt?: Date | string
  }

  export type FarmManagementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mgmtAbility?: NullableStringFieldUpdateOperationsInput | string | null
    operationsResponsible?: NullableStringFieldUpdateOperationsInput | string | null
    opsResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    operators?: NullableStringFieldUpdateOperationsInput | string | null
    otherOperator?: NullableStringFieldUpdateOperationsInput | string | null
    desiredInvolvement?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmManagementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mgmtAbility?: NullableStringFieldUpdateOperationsInput | string | null
    operationsResponsible?: NullableStringFieldUpdateOperationsInput | string | null
    opsResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    operators?: NullableStringFieldUpdateOperationsInput | string | null
    otherOperator?: NullableStringFieldUpdateOperationsInput | string | null
    desiredInvolvement?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperatingStyleCreateInput = {
    id?: string
    decisionStyle?: string | null
    failureResponse?: string | null
    obstacles?: string | null
    otherObstacle?: string | null
    guidancePreference?: string | null
    trackingFrequency?: string | null
    updatePreferences?: string | null
    updatePreference?: string | null
    communicationChannels?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOperatingStyleInput
  }

  export type OperatingStyleUncheckedCreateInput = {
    id?: string
    userId: string
    decisionStyle?: string | null
    failureResponse?: string | null
    obstacles?: string | null
    otherObstacle?: string | null
    guidancePreference?: string | null
    trackingFrequency?: string | null
    updatePreferences?: string | null
    updatePreference?: string | null
    communicationChannels?: string | null
    updatedAt?: Date | string
  }

  export type OperatingStyleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    decisionStyle?: NullableStringFieldUpdateOperationsInput | string | null
    failureResponse?: NullableStringFieldUpdateOperationsInput | string | null
    obstacles?: NullableStringFieldUpdateOperationsInput | string | null
    otherObstacle?: NullableStringFieldUpdateOperationsInput | string | null
    guidancePreference?: NullableStringFieldUpdateOperationsInput | string | null
    trackingFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreferences?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreference?: NullableStringFieldUpdateOperationsInput | string | null
    communicationChannels?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOperatingStyleNestedInput
  }

  export type OperatingStyleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    decisionStyle?: NullableStringFieldUpdateOperationsInput | string | null
    failureResponse?: NullableStringFieldUpdateOperationsInput | string | null
    obstacles?: NullableStringFieldUpdateOperationsInput | string | null
    otherObstacle?: NullableStringFieldUpdateOperationsInput | string | null
    guidancePreference?: NullableStringFieldUpdateOperationsInput | string | null
    trackingFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreferences?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreference?: NullableStringFieldUpdateOperationsInput | string | null
    communicationChannels?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperatingStyleCreateManyInput = {
    id?: string
    userId: string
    decisionStyle?: string | null
    failureResponse?: string | null
    obstacles?: string | null
    otherObstacle?: string | null
    guidancePreference?: string | null
    trackingFrequency?: string | null
    updatePreferences?: string | null
    updatePreference?: string | null
    communicationChannels?: string | null
    updatedAt?: Date | string
  }

  export type OperatingStyleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    decisionStyle?: NullableStringFieldUpdateOperationsInput | string | null
    failureResponse?: NullableStringFieldUpdateOperationsInput | string | null
    obstacles?: NullableStringFieldUpdateOperationsInput | string | null
    otherObstacle?: NullableStringFieldUpdateOperationsInput | string | null
    guidancePreference?: NullableStringFieldUpdateOperationsInput | string | null
    trackingFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreferences?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreference?: NullableStringFieldUpdateOperationsInput | string | null
    communicationChannels?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperatingStyleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    decisionStyle?: NullableStringFieldUpdateOperationsInput | string | null
    failureResponse?: NullableStringFieldUpdateOperationsInput | string | null
    obstacles?: NullableStringFieldUpdateOperationsInput | string | null
    otherObstacle?: NullableStringFieldUpdateOperationsInput | string | null
    guidancePreference?: NullableStringFieldUpdateOperationsInput | string | null
    trackingFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreferences?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreference?: NullableStringFieldUpdateOperationsInput | string | null
    communicationChannels?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DigitalPlatformCreateInput = {
    id?: string
    supportReasons?: string | null
    otherSupportReason?: string | null
    remoteConfidence?: string | null
    remoteComfort?: string | null
    recordKeeping?: string | null
    physicalAudits?: string | null
    additionalNotes?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDigitalPlatformInput
  }

  export type DigitalPlatformUncheckedCreateInput = {
    id?: string
    userId: string
    supportReasons?: string | null
    otherSupportReason?: string | null
    remoteConfidence?: string | null
    remoteComfort?: string | null
    recordKeeping?: string | null
    physicalAudits?: string | null
    additionalNotes?: string | null
    updatedAt?: Date | string
  }

  export type DigitalPlatformUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    supportReasons?: NullableStringFieldUpdateOperationsInput | string | null
    otherSupportReason?: NullableStringFieldUpdateOperationsInput | string | null
    remoteConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    remoteComfort?: NullableStringFieldUpdateOperationsInput | string | null
    recordKeeping?: NullableStringFieldUpdateOperationsInput | string | null
    physicalAudits?: NullableStringFieldUpdateOperationsInput | string | null
    additionalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDigitalPlatformNestedInput
  }

  export type DigitalPlatformUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    supportReasons?: NullableStringFieldUpdateOperationsInput | string | null
    otherSupportReason?: NullableStringFieldUpdateOperationsInput | string | null
    remoteConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    remoteComfort?: NullableStringFieldUpdateOperationsInput | string | null
    recordKeeping?: NullableStringFieldUpdateOperationsInput | string | null
    physicalAudits?: NullableStringFieldUpdateOperationsInput | string | null
    additionalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DigitalPlatformCreateManyInput = {
    id?: string
    userId: string
    supportReasons?: string | null
    otherSupportReason?: string | null
    remoteConfidence?: string | null
    remoteComfort?: string | null
    recordKeeping?: string | null
    physicalAudits?: string | null
    additionalNotes?: string | null
    updatedAt?: Date | string
  }

  export type DigitalPlatformUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    supportReasons?: NullableStringFieldUpdateOperationsInput | string | null
    otherSupportReason?: NullableStringFieldUpdateOperationsInput | string | null
    remoteConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    remoteComfort?: NullableStringFieldUpdateOperationsInput | string | null
    recordKeeping?: NullableStringFieldUpdateOperationsInput | string | null
    physicalAudits?: NullableStringFieldUpdateOperationsInput | string | null
    additionalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DigitalPlatformUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    supportReasons?: NullableStringFieldUpdateOperationsInput | string | null
    otherSupportReason?: NullableStringFieldUpdateOperationsInput | string | null
    remoteConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    remoteComfort?: NullableStringFieldUpdateOperationsInput | string | null
    recordKeeping?: NullableStringFieldUpdateOperationsInput | string | null
    physicalAudits?: NullableStringFieldUpdateOperationsInput | string | null
    additionalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AspirationCreateInput = {
    id?: string
    twelveMonthSuccess?: string | null
    greatestImpactSupport?: string | null
    marketInsight?: string | null
    threeToFiveYearRole?: string | null
    managerResponsibilities?: string | null
    fmResponsibility?: string | null
    handoverResponsibilities?: string | null
    personallyApprovedDecisions?: string | null
    twentyFiveYearVision?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAspirationInput
  }

  export type AspirationUncheckedCreateInput = {
    id?: string
    userId: string
    twelveMonthSuccess?: string | null
    greatestImpactSupport?: string | null
    marketInsight?: string | null
    threeToFiveYearRole?: string | null
    managerResponsibilities?: string | null
    fmResponsibility?: string | null
    handoverResponsibilities?: string | null
    personallyApprovedDecisions?: string | null
    twentyFiveYearVision?: string | null
    updatedAt?: Date | string
  }

  export type AspirationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    twelveMonthSuccess?: NullableStringFieldUpdateOperationsInput | string | null
    greatestImpactSupport?: NullableStringFieldUpdateOperationsInput | string | null
    marketInsight?: NullableStringFieldUpdateOperationsInput | string | null
    threeToFiveYearRole?: NullableStringFieldUpdateOperationsInput | string | null
    managerResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    fmResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    handoverResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    personallyApprovedDecisions?: NullableStringFieldUpdateOperationsInput | string | null
    twentyFiveYearVision?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAspirationNestedInput
  }

  export type AspirationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    twelveMonthSuccess?: NullableStringFieldUpdateOperationsInput | string | null
    greatestImpactSupport?: NullableStringFieldUpdateOperationsInput | string | null
    marketInsight?: NullableStringFieldUpdateOperationsInput | string | null
    threeToFiveYearRole?: NullableStringFieldUpdateOperationsInput | string | null
    managerResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    fmResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    handoverResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    personallyApprovedDecisions?: NullableStringFieldUpdateOperationsInput | string | null
    twentyFiveYearVision?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AspirationCreateManyInput = {
    id?: string
    userId: string
    twelveMonthSuccess?: string | null
    greatestImpactSupport?: string | null
    marketInsight?: string | null
    threeToFiveYearRole?: string | null
    managerResponsibilities?: string | null
    fmResponsibility?: string | null
    handoverResponsibilities?: string | null
    personallyApprovedDecisions?: string | null
    twentyFiveYearVision?: string | null
    updatedAt?: Date | string
  }

  export type AspirationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    twelveMonthSuccess?: NullableStringFieldUpdateOperationsInput | string | null
    greatestImpactSupport?: NullableStringFieldUpdateOperationsInput | string | null
    marketInsight?: NullableStringFieldUpdateOperationsInput | string | null
    threeToFiveYearRole?: NullableStringFieldUpdateOperationsInput | string | null
    managerResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    fmResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    handoverResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    personallyApprovedDecisions?: NullableStringFieldUpdateOperationsInput | string | null
    twentyFiveYearVision?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AspirationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    twelveMonthSuccess?: NullableStringFieldUpdateOperationsInput | string | null
    greatestImpactSupport?: NullableStringFieldUpdateOperationsInput | string | null
    marketInsight?: NullableStringFieldUpdateOperationsInput | string | null
    threeToFiveYearRole?: NullableStringFieldUpdateOperationsInput | string | null
    managerResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    fmResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    handoverResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    personallyApprovedDecisions?: NullableStringFieldUpdateOperationsInput | string | null
    twentyFiveYearVision?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    planType: string
    amount: number
    currency?: string
    paymentMethod: string
    phoneNumber?: string | null
    status?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    userId: string
    planType: string
    amount: number
    currency?: string
    paymentMethod: string
    phoneNumber?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateManyInput = {
    id?: string
    userId: string
    planType: string
    amount: number
    currency?: string
    paymentMethod: string
    phoneNumber?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentCreateInput = {
    id?: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAssessmentsInput
    pillarAssessments?: PillarAssessmentCreateNestedManyWithoutAssessmentInput
    assessmentResponses?: AssessmentResponseCreateNestedManyWithoutAssessmentInput
  }

  export type AssessmentUncheckedCreateInput = {
    id?: string
    userId: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pillarAssessments?: PillarAssessmentUncheckedCreateNestedManyWithoutAssessmentInput
    assessmentResponses?: AssessmentResponseUncheckedCreateNestedManyWithoutAssessmentInput
  }

  export type AssessmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAssessmentsNestedInput
    pillarAssessments?: PillarAssessmentUpdateManyWithoutAssessmentNestedInput
    assessmentResponses?: AssessmentResponseUpdateManyWithoutAssessmentNestedInput
  }

  export type AssessmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pillarAssessments?: PillarAssessmentUncheckedUpdateManyWithoutAssessmentNestedInput
    assessmentResponses?: AssessmentResponseUncheckedUpdateManyWithoutAssessmentNestedInput
  }

  export type AssessmentCreateManyInput = {
    id?: string
    userId: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AssessmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PillarAssessmentCreateInput = {
    id?: string
    pillarId: number
    pillarName: string
    score?: number
    yesCount?: number
    noCount?: number
    totalQuestions?: number
    maturityLevel?: string
    capabilityScores?: string
    isCompleted?: boolean
    completedAt?: Date | string | null
    updatedAt?: Date | string
    assessment: AssessmentCreateNestedOneWithoutPillarAssessmentsInput
  }

  export type PillarAssessmentUncheckedCreateInput = {
    id?: string
    assessmentId: string
    pillarId: number
    pillarName: string
    score?: number
    yesCount?: number
    noCount?: number
    totalQuestions?: number
    maturityLevel?: string
    capabilityScores?: string
    isCompleted?: boolean
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type PillarAssessmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    pillarName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    yesCount?: IntFieldUpdateOperationsInput | number
    noCount?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    capabilityScores?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assessment?: AssessmentUpdateOneRequiredWithoutPillarAssessmentsNestedInput
  }

  export type PillarAssessmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assessmentId?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    pillarName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    yesCount?: IntFieldUpdateOperationsInput | number
    noCount?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    capabilityScores?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PillarAssessmentCreateManyInput = {
    id?: string
    assessmentId: string
    pillarId: number
    pillarName: string
    score?: number
    yesCount?: number
    noCount?: number
    totalQuestions?: number
    maturityLevel?: string
    capabilityScores?: string
    isCompleted?: boolean
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type PillarAssessmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    pillarName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    yesCount?: IntFieldUpdateOperationsInput | number
    noCount?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    capabilityScores?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PillarAssessmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assessmentId?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    pillarName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    yesCount?: IntFieldUpdateOperationsInput | number
    noCount?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    capabilityScores?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentResponseCreateInput = {
    id?: string
    pillarId: number
    capabilityId: string
    capabilityName?: string | null
    questionId: string
    questionText: string
    answer: string
    recommendation?: string | null
    whyItMatters?: string | null
    quickWin?: string | null
    supportAvailable?: string | null
    priority?: string | null
    updatedAt?: Date | string
    assessment: AssessmentCreateNestedOneWithoutAssessmentResponsesInput
  }

  export type AssessmentResponseUncheckedCreateInput = {
    id?: string
    assessmentId: string
    pillarId: number
    capabilityId: string
    capabilityName?: string | null
    questionId: string
    questionText: string
    answer: string
    recommendation?: string | null
    whyItMatters?: string | null
    quickWin?: string | null
    supportAvailable?: string | null
    priority?: string | null
    updatedAt?: Date | string
  }

  export type AssessmentResponseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    capabilityId?: StringFieldUpdateOperationsInput | string
    capabilityName?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: StringFieldUpdateOperationsInput | string
    questionText?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    quickWin?: NullableStringFieldUpdateOperationsInput | string | null
    supportAvailable?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assessment?: AssessmentUpdateOneRequiredWithoutAssessmentResponsesNestedInput
  }

  export type AssessmentResponseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assessmentId?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    capabilityId?: StringFieldUpdateOperationsInput | string
    capabilityName?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: StringFieldUpdateOperationsInput | string
    questionText?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    quickWin?: NullableStringFieldUpdateOperationsInput | string | null
    supportAvailable?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentResponseCreateManyInput = {
    id?: string
    assessmentId: string
    pillarId: number
    capabilityId: string
    capabilityName?: string | null
    questionId: string
    questionText: string
    answer: string
    recommendation?: string | null
    whyItMatters?: string | null
    quickWin?: string | null
    supportAvailable?: string | null
    priority?: string | null
    updatedAt?: Date | string
  }

  export type AssessmentResponseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    capabilityId?: StringFieldUpdateOperationsInput | string
    capabilityName?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: StringFieldUpdateOperationsInput | string
    questionText?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    quickWin?: NullableStringFieldUpdateOperationsInput | string | null
    supportAvailable?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentResponseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assessmentId?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    capabilityId?: StringFieldUpdateOperationsInput | string
    capabilityName?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: StringFieldUpdateOperationsInput | string
    questionText?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    quickWin?: NullableStringFieldUpdateOperationsInput | string | null
    supportAvailable?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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

  export type FarmerProfileNullableScalarRelationFilter = {
    is?: FarmerProfileWhereInput | null
    isNot?: FarmerProfileWhereInput | null
  }

  export type FarmManagementNullableScalarRelationFilter = {
    is?: FarmManagementWhereInput | null
    isNot?: FarmManagementWhereInput | null
  }

  export type OperatingStyleNullableScalarRelationFilter = {
    is?: OperatingStyleWhereInput | null
    isNot?: OperatingStyleWhereInput | null
  }

  export type DigitalPlatformNullableScalarRelationFilter = {
    is?: DigitalPlatformWhereInput | null
    isNot?: DigitalPlatformWhereInput | null
  }

  export type AspirationNullableScalarRelationFilter = {
    is?: AspirationWhereInput | null
    isNot?: AspirationWhereInput | null
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type AssessmentListRelationFilter = {
    every?: AssessmentWhereInput
    some?: AssessmentWhereInput
    none?: AssessmentWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssessmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    phone?: SortOrder
    farmName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    phone?: SortOrder
    farmName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    phone?: SortOrder
    farmName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FarmerProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrder
    valueChain?: SortOrder
    experienceYears?: SortOrder
    businessHistory?: SortOrder
    educationLevel?: SortOrder
    education?: SortOrder
    otherEducation?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmerProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrder
    valueChain?: SortOrder
    experienceYears?: SortOrder
    businessHistory?: SortOrder
    educationLevel?: SortOrder
    education?: SortOrder
    otherEducation?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmerProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrder
    valueChain?: SortOrder
    experienceYears?: SortOrder
    businessHistory?: SortOrder
    educationLevel?: SortOrder
    education?: SortOrder
    otherEducation?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmManagementCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mgmtAbility?: SortOrder
    operationsResponsible?: SortOrder
    opsResponsibility?: SortOrder
    operators?: SortOrder
    otherOperator?: SortOrder
    desiredInvolvement?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmManagementMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mgmtAbility?: SortOrder
    operationsResponsible?: SortOrder
    opsResponsibility?: SortOrder
    operators?: SortOrder
    otherOperator?: SortOrder
    desiredInvolvement?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmManagementMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mgmtAbility?: SortOrder
    operationsResponsible?: SortOrder
    opsResponsibility?: SortOrder
    operators?: SortOrder
    otherOperator?: SortOrder
    desiredInvolvement?: SortOrder
    updatedAt?: SortOrder
  }

  export type OperatingStyleCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    decisionStyle?: SortOrder
    failureResponse?: SortOrder
    obstacles?: SortOrder
    otherObstacle?: SortOrder
    guidancePreference?: SortOrder
    trackingFrequency?: SortOrder
    updatePreferences?: SortOrder
    updatePreference?: SortOrder
    communicationChannels?: SortOrder
    updatedAt?: SortOrder
  }

  export type OperatingStyleMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    decisionStyle?: SortOrder
    failureResponse?: SortOrder
    obstacles?: SortOrder
    otherObstacle?: SortOrder
    guidancePreference?: SortOrder
    trackingFrequency?: SortOrder
    updatePreferences?: SortOrder
    updatePreference?: SortOrder
    communicationChannels?: SortOrder
    updatedAt?: SortOrder
  }

  export type OperatingStyleMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    decisionStyle?: SortOrder
    failureResponse?: SortOrder
    obstacles?: SortOrder
    otherObstacle?: SortOrder
    guidancePreference?: SortOrder
    trackingFrequency?: SortOrder
    updatePreferences?: SortOrder
    updatePreference?: SortOrder
    communicationChannels?: SortOrder
    updatedAt?: SortOrder
  }

  export type DigitalPlatformCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    supportReasons?: SortOrder
    otherSupportReason?: SortOrder
    remoteConfidence?: SortOrder
    remoteComfort?: SortOrder
    recordKeeping?: SortOrder
    physicalAudits?: SortOrder
    additionalNotes?: SortOrder
    updatedAt?: SortOrder
  }

  export type DigitalPlatformMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    supportReasons?: SortOrder
    otherSupportReason?: SortOrder
    remoteConfidence?: SortOrder
    remoteComfort?: SortOrder
    recordKeeping?: SortOrder
    physicalAudits?: SortOrder
    additionalNotes?: SortOrder
    updatedAt?: SortOrder
  }

  export type DigitalPlatformMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    supportReasons?: SortOrder
    otherSupportReason?: SortOrder
    remoteConfidence?: SortOrder
    remoteComfort?: SortOrder
    recordKeeping?: SortOrder
    physicalAudits?: SortOrder
    additionalNotes?: SortOrder
    updatedAt?: SortOrder
  }

  export type AspirationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    twelveMonthSuccess?: SortOrder
    greatestImpactSupport?: SortOrder
    marketInsight?: SortOrder
    threeToFiveYearRole?: SortOrder
    managerResponsibilities?: SortOrder
    fmResponsibility?: SortOrder
    handoverResponsibilities?: SortOrder
    personallyApprovedDecisions?: SortOrder
    twentyFiveYearVision?: SortOrder
    updatedAt?: SortOrder
  }

  export type AspirationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    twelveMonthSuccess?: SortOrder
    greatestImpactSupport?: SortOrder
    marketInsight?: SortOrder
    threeToFiveYearRole?: SortOrder
    managerResponsibilities?: SortOrder
    fmResponsibility?: SortOrder
    handoverResponsibilities?: SortOrder
    personallyApprovedDecisions?: SortOrder
    twentyFiveYearVision?: SortOrder
    updatedAt?: SortOrder
  }

  export type AspirationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    twelveMonthSuccess?: SortOrder
    greatestImpactSupport?: SortOrder
    marketInsight?: SortOrder
    threeToFiveYearRole?: SortOrder
    managerResponsibilities?: SortOrder
    fmResponsibility?: SortOrder
    handoverResponsibilities?: SortOrder
    personallyApprovedDecisions?: SortOrder
    twentyFiveYearVision?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    planType?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    phoneNumber?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    planType?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    phoneNumber?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    planType?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    phoneNumber?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type PillarAssessmentListRelationFilter = {
    every?: PillarAssessmentWhereInput
    some?: PillarAssessmentWhereInput
    none?: PillarAssessmentWhereInput
  }

  export type AssessmentResponseListRelationFilter = {
    every?: AssessmentResponseWhereInput
    some?: AssessmentResponseWhereInput
    none?: AssessmentResponseWhereInput
  }

  export type PillarAssessmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssessmentResponseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssessmentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    overallScore?: SortOrder
    maturityLevel?: SortOrder
    pillarScores?: SortOrder
    radarData?: SortOrder
    priorityAreas?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssessmentAvgOrderByAggregateInput = {
    overallScore?: SortOrder
  }

  export type AssessmentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    overallScore?: SortOrder
    maturityLevel?: SortOrder
    pillarScores?: SortOrder
    radarData?: SortOrder
    priorityAreas?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssessmentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    overallScore?: SortOrder
    maturityLevel?: SortOrder
    pillarScores?: SortOrder
    radarData?: SortOrder
    priorityAreas?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssessmentSumOrderByAggregateInput = {
    overallScore?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AssessmentScalarRelationFilter = {
    is?: AssessmentWhereInput
    isNot?: AssessmentWhereInput
  }

  export type PillarAssessmentAssessmentIdPillarIdCompoundUniqueInput = {
    assessmentId: string
    pillarId: number
  }

  export type PillarAssessmentCountOrderByAggregateInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    pillarName?: SortOrder
    score?: SortOrder
    yesCount?: SortOrder
    noCount?: SortOrder
    totalQuestions?: SortOrder
    maturityLevel?: SortOrder
    capabilityScores?: SortOrder
    isCompleted?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PillarAssessmentAvgOrderByAggregateInput = {
    pillarId?: SortOrder
    score?: SortOrder
    yesCount?: SortOrder
    noCount?: SortOrder
    totalQuestions?: SortOrder
  }

  export type PillarAssessmentMaxOrderByAggregateInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    pillarName?: SortOrder
    score?: SortOrder
    yesCount?: SortOrder
    noCount?: SortOrder
    totalQuestions?: SortOrder
    maturityLevel?: SortOrder
    capabilityScores?: SortOrder
    isCompleted?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PillarAssessmentMinOrderByAggregateInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    pillarName?: SortOrder
    score?: SortOrder
    yesCount?: SortOrder
    noCount?: SortOrder
    totalQuestions?: SortOrder
    maturityLevel?: SortOrder
    capabilityScores?: SortOrder
    isCompleted?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PillarAssessmentSumOrderByAggregateInput = {
    pillarId?: SortOrder
    score?: SortOrder
    yesCount?: SortOrder
    noCount?: SortOrder
    totalQuestions?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AssessmentResponseAssessmentIdQuestionIdCompoundUniqueInput = {
    assessmentId: string
    questionId: string
  }

  export type AssessmentResponseCountOrderByAggregateInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    capabilityId?: SortOrder
    capabilityName?: SortOrder
    questionId?: SortOrder
    questionText?: SortOrder
    answer?: SortOrder
    recommendation?: SortOrder
    whyItMatters?: SortOrder
    quickWin?: SortOrder
    supportAvailable?: SortOrder
    priority?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssessmentResponseAvgOrderByAggregateInput = {
    pillarId?: SortOrder
  }

  export type AssessmentResponseMaxOrderByAggregateInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    capabilityId?: SortOrder
    capabilityName?: SortOrder
    questionId?: SortOrder
    questionText?: SortOrder
    answer?: SortOrder
    recommendation?: SortOrder
    whyItMatters?: SortOrder
    quickWin?: SortOrder
    supportAvailable?: SortOrder
    priority?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssessmentResponseMinOrderByAggregateInput = {
    id?: SortOrder
    assessmentId?: SortOrder
    pillarId?: SortOrder
    capabilityId?: SortOrder
    capabilityName?: SortOrder
    questionId?: SortOrder
    questionText?: SortOrder
    answer?: SortOrder
    recommendation?: SortOrder
    whyItMatters?: SortOrder
    quickWin?: SortOrder
    supportAvailable?: SortOrder
    priority?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssessmentResponseSumOrderByAggregateInput = {
    pillarId?: SortOrder
  }

  export type FarmerProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<FarmerProfileCreateWithoutUserInput, FarmerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: FarmerProfileCreateOrConnectWithoutUserInput
    connect?: FarmerProfileWhereUniqueInput
  }

  export type FarmManagementCreateNestedOneWithoutUserInput = {
    create?: XOR<FarmManagementCreateWithoutUserInput, FarmManagementUncheckedCreateWithoutUserInput>
    connectOrCreate?: FarmManagementCreateOrConnectWithoutUserInput
    connect?: FarmManagementWhereUniqueInput
  }

  export type OperatingStyleCreateNestedOneWithoutUserInput = {
    create?: XOR<OperatingStyleCreateWithoutUserInput, OperatingStyleUncheckedCreateWithoutUserInput>
    connectOrCreate?: OperatingStyleCreateOrConnectWithoutUserInput
    connect?: OperatingStyleWhereUniqueInput
  }

  export type DigitalPlatformCreateNestedOneWithoutUserInput = {
    create?: XOR<DigitalPlatformCreateWithoutUserInput, DigitalPlatformUncheckedCreateWithoutUserInput>
    connectOrCreate?: DigitalPlatformCreateOrConnectWithoutUserInput
    connect?: DigitalPlatformWhereUniqueInput
  }

  export type AspirationCreateNestedOneWithoutUserInput = {
    create?: XOR<AspirationCreateWithoutUserInput, AspirationUncheckedCreateWithoutUserInput>
    connectOrCreate?: AspirationCreateOrConnectWithoutUserInput
    connect?: AspirationWhereUniqueInput
  }

  export type OrderCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type AssessmentCreateNestedManyWithoutUserInput = {
    create?: XOR<AssessmentCreateWithoutUserInput, AssessmentUncheckedCreateWithoutUserInput> | AssessmentCreateWithoutUserInput[] | AssessmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AssessmentCreateOrConnectWithoutUserInput | AssessmentCreateOrConnectWithoutUserInput[]
    createMany?: AssessmentCreateManyUserInputEnvelope
    connect?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
  }

  export type FarmerProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<FarmerProfileCreateWithoutUserInput, FarmerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: FarmerProfileCreateOrConnectWithoutUserInput
    connect?: FarmerProfileWhereUniqueInput
  }

  export type FarmManagementUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<FarmManagementCreateWithoutUserInput, FarmManagementUncheckedCreateWithoutUserInput>
    connectOrCreate?: FarmManagementCreateOrConnectWithoutUserInput
    connect?: FarmManagementWhereUniqueInput
  }

  export type OperatingStyleUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<OperatingStyleCreateWithoutUserInput, OperatingStyleUncheckedCreateWithoutUserInput>
    connectOrCreate?: OperatingStyleCreateOrConnectWithoutUserInput
    connect?: OperatingStyleWhereUniqueInput
  }

  export type DigitalPlatformUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<DigitalPlatformCreateWithoutUserInput, DigitalPlatformUncheckedCreateWithoutUserInput>
    connectOrCreate?: DigitalPlatformCreateOrConnectWithoutUserInput
    connect?: DigitalPlatformWhereUniqueInput
  }

  export type AspirationUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<AspirationCreateWithoutUserInput, AspirationUncheckedCreateWithoutUserInput>
    connectOrCreate?: AspirationCreateOrConnectWithoutUserInput
    connect?: AspirationWhereUniqueInput
  }

  export type OrderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type AssessmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AssessmentCreateWithoutUserInput, AssessmentUncheckedCreateWithoutUserInput> | AssessmentCreateWithoutUserInput[] | AssessmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AssessmentCreateOrConnectWithoutUserInput | AssessmentCreateOrConnectWithoutUserInput[]
    createMany?: AssessmentCreateManyUserInputEnvelope
    connect?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FarmerProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<FarmerProfileCreateWithoutUserInput, FarmerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: FarmerProfileCreateOrConnectWithoutUserInput
    upsert?: FarmerProfileUpsertWithoutUserInput
    disconnect?: FarmerProfileWhereInput | boolean
    delete?: FarmerProfileWhereInput | boolean
    connect?: FarmerProfileWhereUniqueInput
    update?: XOR<XOR<FarmerProfileUpdateToOneWithWhereWithoutUserInput, FarmerProfileUpdateWithoutUserInput>, FarmerProfileUncheckedUpdateWithoutUserInput>
  }

  export type FarmManagementUpdateOneWithoutUserNestedInput = {
    create?: XOR<FarmManagementCreateWithoutUserInput, FarmManagementUncheckedCreateWithoutUserInput>
    connectOrCreate?: FarmManagementCreateOrConnectWithoutUserInput
    upsert?: FarmManagementUpsertWithoutUserInput
    disconnect?: FarmManagementWhereInput | boolean
    delete?: FarmManagementWhereInput | boolean
    connect?: FarmManagementWhereUniqueInput
    update?: XOR<XOR<FarmManagementUpdateToOneWithWhereWithoutUserInput, FarmManagementUpdateWithoutUserInput>, FarmManagementUncheckedUpdateWithoutUserInput>
  }

  export type OperatingStyleUpdateOneWithoutUserNestedInput = {
    create?: XOR<OperatingStyleCreateWithoutUserInput, OperatingStyleUncheckedCreateWithoutUserInput>
    connectOrCreate?: OperatingStyleCreateOrConnectWithoutUserInput
    upsert?: OperatingStyleUpsertWithoutUserInput
    disconnect?: OperatingStyleWhereInput | boolean
    delete?: OperatingStyleWhereInput | boolean
    connect?: OperatingStyleWhereUniqueInput
    update?: XOR<XOR<OperatingStyleUpdateToOneWithWhereWithoutUserInput, OperatingStyleUpdateWithoutUserInput>, OperatingStyleUncheckedUpdateWithoutUserInput>
  }

  export type DigitalPlatformUpdateOneWithoutUserNestedInput = {
    create?: XOR<DigitalPlatformCreateWithoutUserInput, DigitalPlatformUncheckedCreateWithoutUserInput>
    connectOrCreate?: DigitalPlatformCreateOrConnectWithoutUserInput
    upsert?: DigitalPlatformUpsertWithoutUserInput
    disconnect?: DigitalPlatformWhereInput | boolean
    delete?: DigitalPlatformWhereInput | boolean
    connect?: DigitalPlatformWhereUniqueInput
    update?: XOR<XOR<DigitalPlatformUpdateToOneWithWhereWithoutUserInput, DigitalPlatformUpdateWithoutUserInput>, DigitalPlatformUncheckedUpdateWithoutUserInput>
  }

  export type AspirationUpdateOneWithoutUserNestedInput = {
    create?: XOR<AspirationCreateWithoutUserInput, AspirationUncheckedCreateWithoutUserInput>
    connectOrCreate?: AspirationCreateOrConnectWithoutUserInput
    upsert?: AspirationUpsertWithoutUserInput
    disconnect?: AspirationWhereInput | boolean
    delete?: AspirationWhereInput | boolean
    connect?: AspirationWhereUniqueInput
    update?: XOR<XOR<AspirationUpdateToOneWithWhereWithoutUserInput, AspirationUpdateWithoutUserInput>, AspirationUncheckedUpdateWithoutUserInput>
  }

  export type OrderUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type AssessmentUpdateManyWithoutUserNestedInput = {
    create?: XOR<AssessmentCreateWithoutUserInput, AssessmentUncheckedCreateWithoutUserInput> | AssessmentCreateWithoutUserInput[] | AssessmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AssessmentCreateOrConnectWithoutUserInput | AssessmentCreateOrConnectWithoutUserInput[]
    upsert?: AssessmentUpsertWithWhereUniqueWithoutUserInput | AssessmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AssessmentCreateManyUserInputEnvelope
    set?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
    disconnect?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
    delete?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
    connect?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
    update?: AssessmentUpdateWithWhereUniqueWithoutUserInput | AssessmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AssessmentUpdateManyWithWhereWithoutUserInput | AssessmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AssessmentScalarWhereInput | AssessmentScalarWhereInput[]
  }

  export type FarmerProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<FarmerProfileCreateWithoutUserInput, FarmerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: FarmerProfileCreateOrConnectWithoutUserInput
    upsert?: FarmerProfileUpsertWithoutUserInput
    disconnect?: FarmerProfileWhereInput | boolean
    delete?: FarmerProfileWhereInput | boolean
    connect?: FarmerProfileWhereUniqueInput
    update?: XOR<XOR<FarmerProfileUpdateToOneWithWhereWithoutUserInput, FarmerProfileUpdateWithoutUserInput>, FarmerProfileUncheckedUpdateWithoutUserInput>
  }

  export type FarmManagementUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<FarmManagementCreateWithoutUserInput, FarmManagementUncheckedCreateWithoutUserInput>
    connectOrCreate?: FarmManagementCreateOrConnectWithoutUserInput
    upsert?: FarmManagementUpsertWithoutUserInput
    disconnect?: FarmManagementWhereInput | boolean
    delete?: FarmManagementWhereInput | boolean
    connect?: FarmManagementWhereUniqueInput
    update?: XOR<XOR<FarmManagementUpdateToOneWithWhereWithoutUserInput, FarmManagementUpdateWithoutUserInput>, FarmManagementUncheckedUpdateWithoutUserInput>
  }

  export type OperatingStyleUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<OperatingStyleCreateWithoutUserInput, OperatingStyleUncheckedCreateWithoutUserInput>
    connectOrCreate?: OperatingStyleCreateOrConnectWithoutUserInput
    upsert?: OperatingStyleUpsertWithoutUserInput
    disconnect?: OperatingStyleWhereInput | boolean
    delete?: OperatingStyleWhereInput | boolean
    connect?: OperatingStyleWhereUniqueInput
    update?: XOR<XOR<OperatingStyleUpdateToOneWithWhereWithoutUserInput, OperatingStyleUpdateWithoutUserInput>, OperatingStyleUncheckedUpdateWithoutUserInput>
  }

  export type DigitalPlatformUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<DigitalPlatformCreateWithoutUserInput, DigitalPlatformUncheckedCreateWithoutUserInput>
    connectOrCreate?: DigitalPlatformCreateOrConnectWithoutUserInput
    upsert?: DigitalPlatformUpsertWithoutUserInput
    disconnect?: DigitalPlatformWhereInput | boolean
    delete?: DigitalPlatformWhereInput | boolean
    connect?: DigitalPlatformWhereUniqueInput
    update?: XOR<XOR<DigitalPlatformUpdateToOneWithWhereWithoutUserInput, DigitalPlatformUpdateWithoutUserInput>, DigitalPlatformUncheckedUpdateWithoutUserInput>
  }

  export type AspirationUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<AspirationCreateWithoutUserInput, AspirationUncheckedCreateWithoutUserInput>
    connectOrCreate?: AspirationCreateOrConnectWithoutUserInput
    upsert?: AspirationUpsertWithoutUserInput
    disconnect?: AspirationWhereInput | boolean
    delete?: AspirationWhereInput | boolean
    connect?: AspirationWhereUniqueInput
    update?: XOR<XOR<AspirationUpdateToOneWithWhereWithoutUserInput, AspirationUpdateWithoutUserInput>, AspirationUncheckedUpdateWithoutUserInput>
  }

  export type OrderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type AssessmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AssessmentCreateWithoutUserInput, AssessmentUncheckedCreateWithoutUserInput> | AssessmentCreateWithoutUserInput[] | AssessmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AssessmentCreateOrConnectWithoutUserInput | AssessmentCreateOrConnectWithoutUserInput[]
    upsert?: AssessmentUpsertWithWhereUniqueWithoutUserInput | AssessmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AssessmentCreateManyUserInputEnvelope
    set?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
    disconnect?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
    delete?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
    connect?: AssessmentWhereUniqueInput | AssessmentWhereUniqueInput[]
    update?: AssessmentUpdateWithWhereUniqueWithoutUserInput | AssessmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AssessmentUpdateManyWithWhereWithoutUserInput | AssessmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AssessmentScalarWhereInput | AssessmentScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutFarmerProfileInput = {
    create?: XOR<UserCreateWithoutFarmerProfileInput, UserUncheckedCreateWithoutFarmerProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutFarmerProfileInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFarmerProfileNestedInput = {
    create?: XOR<UserCreateWithoutFarmerProfileInput, UserUncheckedCreateWithoutFarmerProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutFarmerProfileInput
    upsert?: UserUpsertWithoutFarmerProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFarmerProfileInput, UserUpdateWithoutFarmerProfileInput>, UserUncheckedUpdateWithoutFarmerProfileInput>
  }

  export type UserCreateNestedOneWithoutFarmManagementInput = {
    create?: XOR<UserCreateWithoutFarmManagementInput, UserUncheckedCreateWithoutFarmManagementInput>
    connectOrCreate?: UserCreateOrConnectWithoutFarmManagementInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFarmManagementNestedInput = {
    create?: XOR<UserCreateWithoutFarmManagementInput, UserUncheckedCreateWithoutFarmManagementInput>
    connectOrCreate?: UserCreateOrConnectWithoutFarmManagementInput
    upsert?: UserUpsertWithoutFarmManagementInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFarmManagementInput, UserUpdateWithoutFarmManagementInput>, UserUncheckedUpdateWithoutFarmManagementInput>
  }

  export type UserCreateNestedOneWithoutOperatingStyleInput = {
    create?: XOR<UserCreateWithoutOperatingStyleInput, UserUncheckedCreateWithoutOperatingStyleInput>
    connectOrCreate?: UserCreateOrConnectWithoutOperatingStyleInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutOperatingStyleNestedInput = {
    create?: XOR<UserCreateWithoutOperatingStyleInput, UserUncheckedCreateWithoutOperatingStyleInput>
    connectOrCreate?: UserCreateOrConnectWithoutOperatingStyleInput
    upsert?: UserUpsertWithoutOperatingStyleInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOperatingStyleInput, UserUpdateWithoutOperatingStyleInput>, UserUncheckedUpdateWithoutOperatingStyleInput>
  }

  export type UserCreateNestedOneWithoutDigitalPlatformInput = {
    create?: XOR<UserCreateWithoutDigitalPlatformInput, UserUncheckedCreateWithoutDigitalPlatformInput>
    connectOrCreate?: UserCreateOrConnectWithoutDigitalPlatformInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDigitalPlatformNestedInput = {
    create?: XOR<UserCreateWithoutDigitalPlatformInput, UserUncheckedCreateWithoutDigitalPlatformInput>
    connectOrCreate?: UserCreateOrConnectWithoutDigitalPlatformInput
    upsert?: UserUpsertWithoutDigitalPlatformInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDigitalPlatformInput, UserUpdateWithoutDigitalPlatformInput>, UserUncheckedUpdateWithoutDigitalPlatformInput>
  }

  export type UserCreateNestedOneWithoutAspirationInput = {
    create?: XOR<UserCreateWithoutAspirationInput, UserUncheckedCreateWithoutAspirationInput>
    connectOrCreate?: UserCreateOrConnectWithoutAspirationInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAspirationNestedInput = {
    create?: XOR<UserCreateWithoutAspirationInput, UserUncheckedCreateWithoutAspirationInput>
    connectOrCreate?: UserCreateOrConnectWithoutAspirationInput
    upsert?: UserUpsertWithoutAspirationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAspirationInput, UserUpdateWithoutAspirationInput>, UserUncheckedUpdateWithoutAspirationInput>
  }

  export type UserCreateNestedOneWithoutOrdersInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    upsert?: UserUpsertWithoutOrdersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrdersInput, UserUpdateWithoutOrdersInput>, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type UserCreateNestedOneWithoutAssessmentsInput = {
    create?: XOR<UserCreateWithoutAssessmentsInput, UserUncheckedCreateWithoutAssessmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssessmentsInput
    connect?: UserWhereUniqueInput
  }

  export type PillarAssessmentCreateNestedManyWithoutAssessmentInput = {
    create?: XOR<PillarAssessmentCreateWithoutAssessmentInput, PillarAssessmentUncheckedCreateWithoutAssessmentInput> | PillarAssessmentCreateWithoutAssessmentInput[] | PillarAssessmentUncheckedCreateWithoutAssessmentInput[]
    connectOrCreate?: PillarAssessmentCreateOrConnectWithoutAssessmentInput | PillarAssessmentCreateOrConnectWithoutAssessmentInput[]
    createMany?: PillarAssessmentCreateManyAssessmentInputEnvelope
    connect?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
  }

  export type AssessmentResponseCreateNestedManyWithoutAssessmentInput = {
    create?: XOR<AssessmentResponseCreateWithoutAssessmentInput, AssessmentResponseUncheckedCreateWithoutAssessmentInput> | AssessmentResponseCreateWithoutAssessmentInput[] | AssessmentResponseUncheckedCreateWithoutAssessmentInput[]
    connectOrCreate?: AssessmentResponseCreateOrConnectWithoutAssessmentInput | AssessmentResponseCreateOrConnectWithoutAssessmentInput[]
    createMany?: AssessmentResponseCreateManyAssessmentInputEnvelope
    connect?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
  }

  export type PillarAssessmentUncheckedCreateNestedManyWithoutAssessmentInput = {
    create?: XOR<PillarAssessmentCreateWithoutAssessmentInput, PillarAssessmentUncheckedCreateWithoutAssessmentInput> | PillarAssessmentCreateWithoutAssessmentInput[] | PillarAssessmentUncheckedCreateWithoutAssessmentInput[]
    connectOrCreate?: PillarAssessmentCreateOrConnectWithoutAssessmentInput | PillarAssessmentCreateOrConnectWithoutAssessmentInput[]
    createMany?: PillarAssessmentCreateManyAssessmentInputEnvelope
    connect?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
  }

  export type AssessmentResponseUncheckedCreateNestedManyWithoutAssessmentInput = {
    create?: XOR<AssessmentResponseCreateWithoutAssessmentInput, AssessmentResponseUncheckedCreateWithoutAssessmentInput> | AssessmentResponseCreateWithoutAssessmentInput[] | AssessmentResponseUncheckedCreateWithoutAssessmentInput[]
    connectOrCreate?: AssessmentResponseCreateOrConnectWithoutAssessmentInput | AssessmentResponseCreateOrConnectWithoutAssessmentInput[]
    createMany?: AssessmentResponseCreateManyAssessmentInputEnvelope
    connect?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAssessmentsNestedInput = {
    create?: XOR<UserCreateWithoutAssessmentsInput, UserUncheckedCreateWithoutAssessmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssessmentsInput
    upsert?: UserUpsertWithoutAssessmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAssessmentsInput, UserUpdateWithoutAssessmentsInput>, UserUncheckedUpdateWithoutAssessmentsInput>
  }

  export type PillarAssessmentUpdateManyWithoutAssessmentNestedInput = {
    create?: XOR<PillarAssessmentCreateWithoutAssessmentInput, PillarAssessmentUncheckedCreateWithoutAssessmentInput> | PillarAssessmentCreateWithoutAssessmentInput[] | PillarAssessmentUncheckedCreateWithoutAssessmentInput[]
    connectOrCreate?: PillarAssessmentCreateOrConnectWithoutAssessmentInput | PillarAssessmentCreateOrConnectWithoutAssessmentInput[]
    upsert?: PillarAssessmentUpsertWithWhereUniqueWithoutAssessmentInput | PillarAssessmentUpsertWithWhereUniqueWithoutAssessmentInput[]
    createMany?: PillarAssessmentCreateManyAssessmentInputEnvelope
    set?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
    disconnect?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
    delete?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
    connect?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
    update?: PillarAssessmentUpdateWithWhereUniqueWithoutAssessmentInput | PillarAssessmentUpdateWithWhereUniqueWithoutAssessmentInput[]
    updateMany?: PillarAssessmentUpdateManyWithWhereWithoutAssessmentInput | PillarAssessmentUpdateManyWithWhereWithoutAssessmentInput[]
    deleteMany?: PillarAssessmentScalarWhereInput | PillarAssessmentScalarWhereInput[]
  }

  export type AssessmentResponseUpdateManyWithoutAssessmentNestedInput = {
    create?: XOR<AssessmentResponseCreateWithoutAssessmentInput, AssessmentResponseUncheckedCreateWithoutAssessmentInput> | AssessmentResponseCreateWithoutAssessmentInput[] | AssessmentResponseUncheckedCreateWithoutAssessmentInput[]
    connectOrCreate?: AssessmentResponseCreateOrConnectWithoutAssessmentInput | AssessmentResponseCreateOrConnectWithoutAssessmentInput[]
    upsert?: AssessmentResponseUpsertWithWhereUniqueWithoutAssessmentInput | AssessmentResponseUpsertWithWhereUniqueWithoutAssessmentInput[]
    createMany?: AssessmentResponseCreateManyAssessmentInputEnvelope
    set?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
    disconnect?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
    delete?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
    connect?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
    update?: AssessmentResponseUpdateWithWhereUniqueWithoutAssessmentInput | AssessmentResponseUpdateWithWhereUniqueWithoutAssessmentInput[]
    updateMany?: AssessmentResponseUpdateManyWithWhereWithoutAssessmentInput | AssessmentResponseUpdateManyWithWhereWithoutAssessmentInput[]
    deleteMany?: AssessmentResponseScalarWhereInput | AssessmentResponseScalarWhereInput[]
  }

  export type PillarAssessmentUncheckedUpdateManyWithoutAssessmentNestedInput = {
    create?: XOR<PillarAssessmentCreateWithoutAssessmentInput, PillarAssessmentUncheckedCreateWithoutAssessmentInput> | PillarAssessmentCreateWithoutAssessmentInput[] | PillarAssessmentUncheckedCreateWithoutAssessmentInput[]
    connectOrCreate?: PillarAssessmentCreateOrConnectWithoutAssessmentInput | PillarAssessmentCreateOrConnectWithoutAssessmentInput[]
    upsert?: PillarAssessmentUpsertWithWhereUniqueWithoutAssessmentInput | PillarAssessmentUpsertWithWhereUniqueWithoutAssessmentInput[]
    createMany?: PillarAssessmentCreateManyAssessmentInputEnvelope
    set?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
    disconnect?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
    delete?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
    connect?: PillarAssessmentWhereUniqueInput | PillarAssessmentWhereUniqueInput[]
    update?: PillarAssessmentUpdateWithWhereUniqueWithoutAssessmentInput | PillarAssessmentUpdateWithWhereUniqueWithoutAssessmentInput[]
    updateMany?: PillarAssessmentUpdateManyWithWhereWithoutAssessmentInput | PillarAssessmentUpdateManyWithWhereWithoutAssessmentInput[]
    deleteMany?: PillarAssessmentScalarWhereInput | PillarAssessmentScalarWhereInput[]
  }

  export type AssessmentResponseUncheckedUpdateManyWithoutAssessmentNestedInput = {
    create?: XOR<AssessmentResponseCreateWithoutAssessmentInput, AssessmentResponseUncheckedCreateWithoutAssessmentInput> | AssessmentResponseCreateWithoutAssessmentInput[] | AssessmentResponseUncheckedCreateWithoutAssessmentInput[]
    connectOrCreate?: AssessmentResponseCreateOrConnectWithoutAssessmentInput | AssessmentResponseCreateOrConnectWithoutAssessmentInput[]
    upsert?: AssessmentResponseUpsertWithWhereUniqueWithoutAssessmentInput | AssessmentResponseUpsertWithWhereUniqueWithoutAssessmentInput[]
    createMany?: AssessmentResponseCreateManyAssessmentInputEnvelope
    set?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
    disconnect?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
    delete?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
    connect?: AssessmentResponseWhereUniqueInput | AssessmentResponseWhereUniqueInput[]
    update?: AssessmentResponseUpdateWithWhereUniqueWithoutAssessmentInput | AssessmentResponseUpdateWithWhereUniqueWithoutAssessmentInput[]
    updateMany?: AssessmentResponseUpdateManyWithWhereWithoutAssessmentInput | AssessmentResponseUpdateManyWithWhereWithoutAssessmentInput[]
    deleteMany?: AssessmentResponseScalarWhereInput | AssessmentResponseScalarWhereInput[]
  }

  export type AssessmentCreateNestedOneWithoutPillarAssessmentsInput = {
    create?: XOR<AssessmentCreateWithoutPillarAssessmentsInput, AssessmentUncheckedCreateWithoutPillarAssessmentsInput>
    connectOrCreate?: AssessmentCreateOrConnectWithoutPillarAssessmentsInput
    connect?: AssessmentWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AssessmentUpdateOneRequiredWithoutPillarAssessmentsNestedInput = {
    create?: XOR<AssessmentCreateWithoutPillarAssessmentsInput, AssessmentUncheckedCreateWithoutPillarAssessmentsInput>
    connectOrCreate?: AssessmentCreateOrConnectWithoutPillarAssessmentsInput
    upsert?: AssessmentUpsertWithoutPillarAssessmentsInput
    connect?: AssessmentWhereUniqueInput
    update?: XOR<XOR<AssessmentUpdateToOneWithWhereWithoutPillarAssessmentsInput, AssessmentUpdateWithoutPillarAssessmentsInput>, AssessmentUncheckedUpdateWithoutPillarAssessmentsInput>
  }

  export type AssessmentCreateNestedOneWithoutAssessmentResponsesInput = {
    create?: XOR<AssessmentCreateWithoutAssessmentResponsesInput, AssessmentUncheckedCreateWithoutAssessmentResponsesInput>
    connectOrCreate?: AssessmentCreateOrConnectWithoutAssessmentResponsesInput
    connect?: AssessmentWhereUniqueInput
  }

  export type AssessmentUpdateOneRequiredWithoutAssessmentResponsesNestedInput = {
    create?: XOR<AssessmentCreateWithoutAssessmentResponsesInput, AssessmentUncheckedCreateWithoutAssessmentResponsesInput>
    connectOrCreate?: AssessmentCreateOrConnectWithoutAssessmentResponsesInput
    upsert?: AssessmentUpsertWithoutAssessmentResponsesInput
    connect?: AssessmentWhereUniqueInput
    update?: XOR<XOR<AssessmentUpdateToOneWithWhereWithoutAssessmentResponsesInput, AssessmentUpdateWithoutAssessmentResponsesInput>, AssessmentUncheckedUpdateWithoutAssessmentResponsesInput>
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
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FarmerProfileCreateWithoutUserInput = {
    id?: string
    jobTitle?: string | null
    valueChain?: string | null
    experienceYears?: string | null
    businessHistory?: string | null
    educationLevel?: string | null
    education?: string | null
    otherEducation?: string | null
    updatedAt?: Date | string
  }

  export type FarmerProfileUncheckedCreateWithoutUserInput = {
    id?: string
    jobTitle?: string | null
    valueChain?: string | null
    experienceYears?: string | null
    businessHistory?: string | null
    educationLevel?: string | null
    education?: string | null
    otherEducation?: string | null
    updatedAt?: Date | string
  }

  export type FarmerProfileCreateOrConnectWithoutUserInput = {
    where: FarmerProfileWhereUniqueInput
    create: XOR<FarmerProfileCreateWithoutUserInput, FarmerProfileUncheckedCreateWithoutUserInput>
  }

  export type FarmManagementCreateWithoutUserInput = {
    id?: string
    mgmtAbility?: string | null
    operationsResponsible?: string | null
    opsResponsibility?: string | null
    operators?: string | null
    otherOperator?: string | null
    desiredInvolvement?: string | null
    updatedAt?: Date | string
  }

  export type FarmManagementUncheckedCreateWithoutUserInput = {
    id?: string
    mgmtAbility?: string | null
    operationsResponsible?: string | null
    opsResponsibility?: string | null
    operators?: string | null
    otherOperator?: string | null
    desiredInvolvement?: string | null
    updatedAt?: Date | string
  }

  export type FarmManagementCreateOrConnectWithoutUserInput = {
    where: FarmManagementWhereUniqueInput
    create: XOR<FarmManagementCreateWithoutUserInput, FarmManagementUncheckedCreateWithoutUserInput>
  }

  export type OperatingStyleCreateWithoutUserInput = {
    id?: string
    decisionStyle?: string | null
    failureResponse?: string | null
    obstacles?: string | null
    otherObstacle?: string | null
    guidancePreference?: string | null
    trackingFrequency?: string | null
    updatePreferences?: string | null
    updatePreference?: string | null
    communicationChannels?: string | null
    updatedAt?: Date | string
  }

  export type OperatingStyleUncheckedCreateWithoutUserInput = {
    id?: string
    decisionStyle?: string | null
    failureResponse?: string | null
    obstacles?: string | null
    otherObstacle?: string | null
    guidancePreference?: string | null
    trackingFrequency?: string | null
    updatePreferences?: string | null
    updatePreference?: string | null
    communicationChannels?: string | null
    updatedAt?: Date | string
  }

  export type OperatingStyleCreateOrConnectWithoutUserInput = {
    where: OperatingStyleWhereUniqueInput
    create: XOR<OperatingStyleCreateWithoutUserInput, OperatingStyleUncheckedCreateWithoutUserInput>
  }

  export type DigitalPlatformCreateWithoutUserInput = {
    id?: string
    supportReasons?: string | null
    otherSupportReason?: string | null
    remoteConfidence?: string | null
    remoteComfort?: string | null
    recordKeeping?: string | null
    physicalAudits?: string | null
    additionalNotes?: string | null
    updatedAt?: Date | string
  }

  export type DigitalPlatformUncheckedCreateWithoutUserInput = {
    id?: string
    supportReasons?: string | null
    otherSupportReason?: string | null
    remoteConfidence?: string | null
    remoteComfort?: string | null
    recordKeeping?: string | null
    physicalAudits?: string | null
    additionalNotes?: string | null
    updatedAt?: Date | string
  }

  export type DigitalPlatformCreateOrConnectWithoutUserInput = {
    where: DigitalPlatformWhereUniqueInput
    create: XOR<DigitalPlatformCreateWithoutUserInput, DigitalPlatformUncheckedCreateWithoutUserInput>
  }

  export type AspirationCreateWithoutUserInput = {
    id?: string
    twelveMonthSuccess?: string | null
    greatestImpactSupport?: string | null
    marketInsight?: string | null
    threeToFiveYearRole?: string | null
    managerResponsibilities?: string | null
    fmResponsibility?: string | null
    handoverResponsibilities?: string | null
    personallyApprovedDecisions?: string | null
    twentyFiveYearVision?: string | null
    updatedAt?: Date | string
  }

  export type AspirationUncheckedCreateWithoutUserInput = {
    id?: string
    twelveMonthSuccess?: string | null
    greatestImpactSupport?: string | null
    marketInsight?: string | null
    threeToFiveYearRole?: string | null
    managerResponsibilities?: string | null
    fmResponsibility?: string | null
    handoverResponsibilities?: string | null
    personallyApprovedDecisions?: string | null
    twentyFiveYearVision?: string | null
    updatedAt?: Date | string
  }

  export type AspirationCreateOrConnectWithoutUserInput = {
    where: AspirationWhereUniqueInput
    create: XOR<AspirationCreateWithoutUserInput, AspirationUncheckedCreateWithoutUserInput>
  }

  export type OrderCreateWithoutUserInput = {
    id?: string
    planType: string
    amount: number
    currency?: string
    paymentMethod: string
    phoneNumber?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type OrderUncheckedCreateWithoutUserInput = {
    id?: string
    planType: string
    amount: number
    currency?: string
    paymentMethod: string
    phoneNumber?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type OrderCreateOrConnectWithoutUserInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderCreateManyUserInputEnvelope = {
    data: OrderCreateManyUserInput | OrderCreateManyUserInput[]
  }

  export type AssessmentCreateWithoutUserInput = {
    id?: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pillarAssessments?: PillarAssessmentCreateNestedManyWithoutAssessmentInput
    assessmentResponses?: AssessmentResponseCreateNestedManyWithoutAssessmentInput
  }

  export type AssessmentUncheckedCreateWithoutUserInput = {
    id?: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pillarAssessments?: PillarAssessmentUncheckedCreateNestedManyWithoutAssessmentInput
    assessmentResponses?: AssessmentResponseUncheckedCreateNestedManyWithoutAssessmentInput
  }

  export type AssessmentCreateOrConnectWithoutUserInput = {
    where: AssessmentWhereUniqueInput
    create: XOR<AssessmentCreateWithoutUserInput, AssessmentUncheckedCreateWithoutUserInput>
  }

  export type AssessmentCreateManyUserInputEnvelope = {
    data: AssessmentCreateManyUserInput | AssessmentCreateManyUserInput[]
  }

  export type FarmerProfileUpsertWithoutUserInput = {
    update: XOR<FarmerProfileUpdateWithoutUserInput, FarmerProfileUncheckedUpdateWithoutUserInput>
    create: XOR<FarmerProfileCreateWithoutUserInput, FarmerProfileUncheckedCreateWithoutUserInput>
    where?: FarmerProfileWhereInput
  }

  export type FarmerProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: FarmerProfileWhereInput
    data: XOR<FarmerProfileUpdateWithoutUserInput, FarmerProfileUncheckedUpdateWithoutUserInput>
  }

  export type FarmerProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    valueChain?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYears?: NullableStringFieldUpdateOperationsInput | string | null
    businessHistory?: NullableStringFieldUpdateOperationsInput | string | null
    educationLevel?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    otherEducation?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmerProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    valueChain?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYears?: NullableStringFieldUpdateOperationsInput | string | null
    businessHistory?: NullableStringFieldUpdateOperationsInput | string | null
    educationLevel?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    otherEducation?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmManagementUpsertWithoutUserInput = {
    update: XOR<FarmManagementUpdateWithoutUserInput, FarmManagementUncheckedUpdateWithoutUserInput>
    create: XOR<FarmManagementCreateWithoutUserInput, FarmManagementUncheckedCreateWithoutUserInput>
    where?: FarmManagementWhereInput
  }

  export type FarmManagementUpdateToOneWithWhereWithoutUserInput = {
    where?: FarmManagementWhereInput
    data: XOR<FarmManagementUpdateWithoutUserInput, FarmManagementUncheckedUpdateWithoutUserInput>
  }

  export type FarmManagementUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mgmtAbility?: NullableStringFieldUpdateOperationsInput | string | null
    operationsResponsible?: NullableStringFieldUpdateOperationsInput | string | null
    opsResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    operators?: NullableStringFieldUpdateOperationsInput | string | null
    otherOperator?: NullableStringFieldUpdateOperationsInput | string | null
    desiredInvolvement?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmManagementUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mgmtAbility?: NullableStringFieldUpdateOperationsInput | string | null
    operationsResponsible?: NullableStringFieldUpdateOperationsInput | string | null
    opsResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    operators?: NullableStringFieldUpdateOperationsInput | string | null
    otherOperator?: NullableStringFieldUpdateOperationsInput | string | null
    desiredInvolvement?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperatingStyleUpsertWithoutUserInput = {
    update: XOR<OperatingStyleUpdateWithoutUserInput, OperatingStyleUncheckedUpdateWithoutUserInput>
    create: XOR<OperatingStyleCreateWithoutUserInput, OperatingStyleUncheckedCreateWithoutUserInput>
    where?: OperatingStyleWhereInput
  }

  export type OperatingStyleUpdateToOneWithWhereWithoutUserInput = {
    where?: OperatingStyleWhereInput
    data: XOR<OperatingStyleUpdateWithoutUserInput, OperatingStyleUncheckedUpdateWithoutUserInput>
  }

  export type OperatingStyleUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    decisionStyle?: NullableStringFieldUpdateOperationsInput | string | null
    failureResponse?: NullableStringFieldUpdateOperationsInput | string | null
    obstacles?: NullableStringFieldUpdateOperationsInput | string | null
    otherObstacle?: NullableStringFieldUpdateOperationsInput | string | null
    guidancePreference?: NullableStringFieldUpdateOperationsInput | string | null
    trackingFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreferences?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreference?: NullableStringFieldUpdateOperationsInput | string | null
    communicationChannels?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperatingStyleUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    decisionStyle?: NullableStringFieldUpdateOperationsInput | string | null
    failureResponse?: NullableStringFieldUpdateOperationsInput | string | null
    obstacles?: NullableStringFieldUpdateOperationsInput | string | null
    otherObstacle?: NullableStringFieldUpdateOperationsInput | string | null
    guidancePreference?: NullableStringFieldUpdateOperationsInput | string | null
    trackingFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreferences?: NullableStringFieldUpdateOperationsInput | string | null
    updatePreference?: NullableStringFieldUpdateOperationsInput | string | null
    communicationChannels?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DigitalPlatformUpsertWithoutUserInput = {
    update: XOR<DigitalPlatformUpdateWithoutUserInput, DigitalPlatformUncheckedUpdateWithoutUserInput>
    create: XOR<DigitalPlatformCreateWithoutUserInput, DigitalPlatformUncheckedCreateWithoutUserInput>
    where?: DigitalPlatformWhereInput
  }

  export type DigitalPlatformUpdateToOneWithWhereWithoutUserInput = {
    where?: DigitalPlatformWhereInput
    data: XOR<DigitalPlatformUpdateWithoutUserInput, DigitalPlatformUncheckedUpdateWithoutUserInput>
  }

  export type DigitalPlatformUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    supportReasons?: NullableStringFieldUpdateOperationsInput | string | null
    otherSupportReason?: NullableStringFieldUpdateOperationsInput | string | null
    remoteConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    remoteComfort?: NullableStringFieldUpdateOperationsInput | string | null
    recordKeeping?: NullableStringFieldUpdateOperationsInput | string | null
    physicalAudits?: NullableStringFieldUpdateOperationsInput | string | null
    additionalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DigitalPlatformUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    supportReasons?: NullableStringFieldUpdateOperationsInput | string | null
    otherSupportReason?: NullableStringFieldUpdateOperationsInput | string | null
    remoteConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    remoteComfort?: NullableStringFieldUpdateOperationsInput | string | null
    recordKeeping?: NullableStringFieldUpdateOperationsInput | string | null
    physicalAudits?: NullableStringFieldUpdateOperationsInput | string | null
    additionalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AspirationUpsertWithoutUserInput = {
    update: XOR<AspirationUpdateWithoutUserInput, AspirationUncheckedUpdateWithoutUserInput>
    create: XOR<AspirationCreateWithoutUserInput, AspirationUncheckedCreateWithoutUserInput>
    where?: AspirationWhereInput
  }

  export type AspirationUpdateToOneWithWhereWithoutUserInput = {
    where?: AspirationWhereInput
    data: XOR<AspirationUpdateWithoutUserInput, AspirationUncheckedUpdateWithoutUserInput>
  }

  export type AspirationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    twelveMonthSuccess?: NullableStringFieldUpdateOperationsInput | string | null
    greatestImpactSupport?: NullableStringFieldUpdateOperationsInput | string | null
    marketInsight?: NullableStringFieldUpdateOperationsInput | string | null
    threeToFiveYearRole?: NullableStringFieldUpdateOperationsInput | string | null
    managerResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    fmResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    handoverResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    personallyApprovedDecisions?: NullableStringFieldUpdateOperationsInput | string | null
    twentyFiveYearVision?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AspirationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    twelveMonthSuccess?: NullableStringFieldUpdateOperationsInput | string | null
    greatestImpactSupport?: NullableStringFieldUpdateOperationsInput | string | null
    marketInsight?: NullableStringFieldUpdateOperationsInput | string | null
    threeToFiveYearRole?: NullableStringFieldUpdateOperationsInput | string | null
    managerResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    fmResponsibility?: NullableStringFieldUpdateOperationsInput | string | null
    handoverResponsibilities?: NullableStringFieldUpdateOperationsInput | string | null
    personallyApprovedDecisions?: NullableStringFieldUpdateOperationsInput | string | null
    twentyFiveYearVision?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpsertWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
  }

  export type OrderUpdateManyWithWhereWithoutUserInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutUserInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    userId?: StringFilter<"Order"> | string
    planType?: StringFilter<"Order"> | string
    amount?: FloatFilter<"Order"> | number
    currency?: StringFilter<"Order"> | string
    paymentMethod?: StringFilter<"Order"> | string
    phoneNumber?: StringNullableFilter<"Order"> | string | null
    status?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
  }

  export type AssessmentUpsertWithWhereUniqueWithoutUserInput = {
    where: AssessmentWhereUniqueInput
    update: XOR<AssessmentUpdateWithoutUserInput, AssessmentUncheckedUpdateWithoutUserInput>
    create: XOR<AssessmentCreateWithoutUserInput, AssessmentUncheckedCreateWithoutUserInput>
  }

  export type AssessmentUpdateWithWhereUniqueWithoutUserInput = {
    where: AssessmentWhereUniqueInput
    data: XOR<AssessmentUpdateWithoutUserInput, AssessmentUncheckedUpdateWithoutUserInput>
  }

  export type AssessmentUpdateManyWithWhereWithoutUserInput = {
    where: AssessmentScalarWhereInput
    data: XOR<AssessmentUpdateManyMutationInput, AssessmentUncheckedUpdateManyWithoutUserInput>
  }

  export type AssessmentScalarWhereInput = {
    AND?: AssessmentScalarWhereInput | AssessmentScalarWhereInput[]
    OR?: AssessmentScalarWhereInput[]
    NOT?: AssessmentScalarWhereInput | AssessmentScalarWhereInput[]
    id?: StringFilter<"Assessment"> | string
    userId?: StringFilter<"Assessment"> | string
    overallScore?: IntFilter<"Assessment"> | number
    maturityLevel?: StringFilter<"Assessment"> | string
    pillarScores?: StringFilter<"Assessment"> | string
    radarData?: StringFilter<"Assessment"> | string
    priorityAreas?: StringFilter<"Assessment"> | string
    status?: StringFilter<"Assessment"> | string
    createdAt?: DateTimeFilter<"Assessment"> | Date | string
    updatedAt?: DateTimeFilter<"Assessment"> | Date | string
  }

  export type UserCreateWithoutFarmerProfileInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmManagement?: FarmManagementCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformCreateNestedOneWithoutUserInput
    aspiration?: AspirationCreateNestedOneWithoutUserInput
    orders?: OrderCreateNestedManyWithoutUserInput
    assessments?: AssessmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFarmerProfileInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmManagement?: FarmManagementUncheckedCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleUncheckedCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformUncheckedCreateNestedOneWithoutUserInput
    aspiration?: AspirationUncheckedCreateNestedOneWithoutUserInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    assessments?: AssessmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFarmerProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFarmerProfileInput, UserUncheckedCreateWithoutFarmerProfileInput>
  }

  export type UserUpsertWithoutFarmerProfileInput = {
    update: XOR<UserUpdateWithoutFarmerProfileInput, UserUncheckedUpdateWithoutFarmerProfileInput>
    create: XOR<UserCreateWithoutFarmerProfileInput, UserUncheckedCreateWithoutFarmerProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFarmerProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFarmerProfileInput, UserUncheckedUpdateWithoutFarmerProfileInput>
  }

  export type UserUpdateWithoutFarmerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmManagement?: FarmManagementUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUpdateOneWithoutUserNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFarmerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmManagement?: FarmManagementUncheckedUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUncheckedUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUncheckedUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUncheckedUpdateOneWithoutUserNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutFarmManagementInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformCreateNestedOneWithoutUserInput
    aspiration?: AspirationCreateNestedOneWithoutUserInput
    orders?: OrderCreateNestedManyWithoutUserInput
    assessments?: AssessmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFarmManagementInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileUncheckedCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleUncheckedCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformUncheckedCreateNestedOneWithoutUserInput
    aspiration?: AspirationUncheckedCreateNestedOneWithoutUserInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    assessments?: AssessmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFarmManagementInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFarmManagementInput, UserUncheckedCreateWithoutFarmManagementInput>
  }

  export type UserUpsertWithoutFarmManagementInput = {
    update: XOR<UserUpdateWithoutFarmManagementInput, UserUncheckedUpdateWithoutFarmManagementInput>
    create: XOR<UserCreateWithoutFarmManagementInput, UserUncheckedCreateWithoutFarmManagementInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFarmManagementInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFarmManagementInput, UserUncheckedUpdateWithoutFarmManagementInput>
  }

  export type UserUpdateWithoutFarmManagementInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUpdateOneWithoutUserNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFarmManagementInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUncheckedUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUncheckedUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUncheckedUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUncheckedUpdateOneWithoutUserNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutOperatingStyleInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformCreateNestedOneWithoutUserInput
    aspiration?: AspirationCreateNestedOneWithoutUserInput
    orders?: OrderCreateNestedManyWithoutUserInput
    assessments?: AssessmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOperatingStyleInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileUncheckedCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementUncheckedCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformUncheckedCreateNestedOneWithoutUserInput
    aspiration?: AspirationUncheckedCreateNestedOneWithoutUserInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    assessments?: AssessmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOperatingStyleInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOperatingStyleInput, UserUncheckedCreateWithoutOperatingStyleInput>
  }

  export type UserUpsertWithoutOperatingStyleInput = {
    update: XOR<UserUpdateWithoutOperatingStyleInput, UserUncheckedUpdateWithoutOperatingStyleInput>
    create: XOR<UserCreateWithoutOperatingStyleInput, UserUncheckedCreateWithoutOperatingStyleInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOperatingStyleInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOperatingStyleInput, UserUncheckedUpdateWithoutOperatingStyleInput>
  }

  export type UserUpdateWithoutOperatingStyleInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUpdateOneWithoutUserNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOperatingStyleInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUncheckedUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUncheckedUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUncheckedUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUncheckedUpdateOneWithoutUserNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDigitalPlatformInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleCreateNestedOneWithoutUserInput
    aspiration?: AspirationCreateNestedOneWithoutUserInput
    orders?: OrderCreateNestedManyWithoutUserInput
    assessments?: AssessmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDigitalPlatformInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileUncheckedCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementUncheckedCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleUncheckedCreateNestedOneWithoutUserInput
    aspiration?: AspirationUncheckedCreateNestedOneWithoutUserInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    assessments?: AssessmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDigitalPlatformInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDigitalPlatformInput, UserUncheckedCreateWithoutDigitalPlatformInput>
  }

  export type UserUpsertWithoutDigitalPlatformInput = {
    update: XOR<UserUpdateWithoutDigitalPlatformInput, UserUncheckedUpdateWithoutDigitalPlatformInput>
    create: XOR<UserCreateWithoutDigitalPlatformInput, UserUncheckedCreateWithoutDigitalPlatformInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDigitalPlatformInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDigitalPlatformInput, UserUncheckedUpdateWithoutDigitalPlatformInput>
  }

  export type UserUpdateWithoutDigitalPlatformInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUpdateOneWithoutUserNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDigitalPlatformInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUncheckedUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUncheckedUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUncheckedUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUncheckedUpdateOneWithoutUserNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAspirationInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformCreateNestedOneWithoutUserInput
    orders?: OrderCreateNestedManyWithoutUserInput
    assessments?: AssessmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAspirationInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileUncheckedCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementUncheckedCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleUncheckedCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformUncheckedCreateNestedOneWithoutUserInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    assessments?: AssessmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAspirationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAspirationInput, UserUncheckedCreateWithoutAspirationInput>
  }

  export type UserUpsertWithoutAspirationInput = {
    update: XOR<UserUpdateWithoutAspirationInput, UserUncheckedUpdateWithoutAspirationInput>
    create: XOR<UserCreateWithoutAspirationInput, UserUncheckedCreateWithoutAspirationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAspirationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAspirationInput, UserUncheckedUpdateWithoutAspirationInput>
  }

  export type UserUpdateWithoutAspirationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUpdateOneWithoutUserNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAspirationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUncheckedUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUncheckedUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUncheckedUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUncheckedUpdateOneWithoutUserNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    assessments?: AssessmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutOrdersInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformCreateNestedOneWithoutUserInput
    aspiration?: AspirationCreateNestedOneWithoutUserInput
    assessments?: AssessmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrdersInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileUncheckedCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementUncheckedCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleUncheckedCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformUncheckedCreateNestedOneWithoutUserInput
    aspiration?: AspirationUncheckedCreateNestedOneWithoutUserInput
    assessments?: AssessmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
  }

  export type UserUpsertWithoutOrdersInput = {
    update: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type UserUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUpdateOneWithoutUserNestedInput
    assessments?: AssessmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUncheckedUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUncheckedUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUncheckedUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUncheckedUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUncheckedUpdateOneWithoutUserNestedInput
    assessments?: AssessmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAssessmentsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformCreateNestedOneWithoutUserInput
    aspiration?: AspirationCreateNestedOneWithoutUserInput
    orders?: OrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAssessmentsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    phone?: string | null
    farmName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    farmerProfile?: FarmerProfileUncheckedCreateNestedOneWithoutUserInput
    farmManagement?: FarmManagementUncheckedCreateNestedOneWithoutUserInput
    operatingStyle?: OperatingStyleUncheckedCreateNestedOneWithoutUserInput
    digitalPlatform?: DigitalPlatformUncheckedCreateNestedOneWithoutUserInput
    aspiration?: AspirationUncheckedCreateNestedOneWithoutUserInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAssessmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAssessmentsInput, UserUncheckedCreateWithoutAssessmentsInput>
  }

  export type PillarAssessmentCreateWithoutAssessmentInput = {
    id?: string
    pillarId: number
    pillarName: string
    score?: number
    yesCount?: number
    noCount?: number
    totalQuestions?: number
    maturityLevel?: string
    capabilityScores?: string
    isCompleted?: boolean
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type PillarAssessmentUncheckedCreateWithoutAssessmentInput = {
    id?: string
    pillarId: number
    pillarName: string
    score?: number
    yesCount?: number
    noCount?: number
    totalQuestions?: number
    maturityLevel?: string
    capabilityScores?: string
    isCompleted?: boolean
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type PillarAssessmentCreateOrConnectWithoutAssessmentInput = {
    where: PillarAssessmentWhereUniqueInput
    create: XOR<PillarAssessmentCreateWithoutAssessmentInput, PillarAssessmentUncheckedCreateWithoutAssessmentInput>
  }

  export type PillarAssessmentCreateManyAssessmentInputEnvelope = {
    data: PillarAssessmentCreateManyAssessmentInput | PillarAssessmentCreateManyAssessmentInput[]
  }

  export type AssessmentResponseCreateWithoutAssessmentInput = {
    id?: string
    pillarId: number
    capabilityId: string
    capabilityName?: string | null
    questionId: string
    questionText: string
    answer: string
    recommendation?: string | null
    whyItMatters?: string | null
    quickWin?: string | null
    supportAvailable?: string | null
    priority?: string | null
    updatedAt?: Date | string
  }

  export type AssessmentResponseUncheckedCreateWithoutAssessmentInput = {
    id?: string
    pillarId: number
    capabilityId: string
    capabilityName?: string | null
    questionId: string
    questionText: string
    answer: string
    recommendation?: string | null
    whyItMatters?: string | null
    quickWin?: string | null
    supportAvailable?: string | null
    priority?: string | null
    updatedAt?: Date | string
  }

  export type AssessmentResponseCreateOrConnectWithoutAssessmentInput = {
    where: AssessmentResponseWhereUniqueInput
    create: XOR<AssessmentResponseCreateWithoutAssessmentInput, AssessmentResponseUncheckedCreateWithoutAssessmentInput>
  }

  export type AssessmentResponseCreateManyAssessmentInputEnvelope = {
    data: AssessmentResponseCreateManyAssessmentInput | AssessmentResponseCreateManyAssessmentInput[]
  }

  export type UserUpsertWithoutAssessmentsInput = {
    update: XOR<UserUpdateWithoutAssessmentsInput, UserUncheckedUpdateWithoutAssessmentsInput>
    create: XOR<UserCreateWithoutAssessmentsInput, UserUncheckedCreateWithoutAssessmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAssessmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAssessmentsInput, UserUncheckedUpdateWithoutAssessmentsInput>
  }

  export type UserUpdateWithoutAssessmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUpdateOneWithoutUserNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAssessmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    farmName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    farmerProfile?: FarmerProfileUncheckedUpdateOneWithoutUserNestedInput
    farmManagement?: FarmManagementUncheckedUpdateOneWithoutUserNestedInput
    operatingStyle?: OperatingStyleUncheckedUpdateOneWithoutUserNestedInput
    digitalPlatform?: DigitalPlatformUncheckedUpdateOneWithoutUserNestedInput
    aspiration?: AspirationUncheckedUpdateOneWithoutUserNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PillarAssessmentUpsertWithWhereUniqueWithoutAssessmentInput = {
    where: PillarAssessmentWhereUniqueInput
    update: XOR<PillarAssessmentUpdateWithoutAssessmentInput, PillarAssessmentUncheckedUpdateWithoutAssessmentInput>
    create: XOR<PillarAssessmentCreateWithoutAssessmentInput, PillarAssessmentUncheckedCreateWithoutAssessmentInput>
  }

  export type PillarAssessmentUpdateWithWhereUniqueWithoutAssessmentInput = {
    where: PillarAssessmentWhereUniqueInput
    data: XOR<PillarAssessmentUpdateWithoutAssessmentInput, PillarAssessmentUncheckedUpdateWithoutAssessmentInput>
  }

  export type PillarAssessmentUpdateManyWithWhereWithoutAssessmentInput = {
    where: PillarAssessmentScalarWhereInput
    data: XOR<PillarAssessmentUpdateManyMutationInput, PillarAssessmentUncheckedUpdateManyWithoutAssessmentInput>
  }

  export type PillarAssessmentScalarWhereInput = {
    AND?: PillarAssessmentScalarWhereInput | PillarAssessmentScalarWhereInput[]
    OR?: PillarAssessmentScalarWhereInput[]
    NOT?: PillarAssessmentScalarWhereInput | PillarAssessmentScalarWhereInput[]
    id?: StringFilter<"PillarAssessment"> | string
    assessmentId?: StringFilter<"PillarAssessment"> | string
    pillarId?: IntFilter<"PillarAssessment"> | number
    pillarName?: StringFilter<"PillarAssessment"> | string
    score?: FloatFilter<"PillarAssessment"> | number
    yesCount?: IntFilter<"PillarAssessment"> | number
    noCount?: IntFilter<"PillarAssessment"> | number
    totalQuestions?: IntFilter<"PillarAssessment"> | number
    maturityLevel?: StringFilter<"PillarAssessment"> | string
    capabilityScores?: StringFilter<"PillarAssessment"> | string
    isCompleted?: BoolFilter<"PillarAssessment"> | boolean
    completedAt?: DateTimeNullableFilter<"PillarAssessment"> | Date | string | null
    updatedAt?: DateTimeFilter<"PillarAssessment"> | Date | string
  }

  export type AssessmentResponseUpsertWithWhereUniqueWithoutAssessmentInput = {
    where: AssessmentResponseWhereUniqueInput
    update: XOR<AssessmentResponseUpdateWithoutAssessmentInput, AssessmentResponseUncheckedUpdateWithoutAssessmentInput>
    create: XOR<AssessmentResponseCreateWithoutAssessmentInput, AssessmentResponseUncheckedCreateWithoutAssessmentInput>
  }

  export type AssessmentResponseUpdateWithWhereUniqueWithoutAssessmentInput = {
    where: AssessmentResponseWhereUniqueInput
    data: XOR<AssessmentResponseUpdateWithoutAssessmentInput, AssessmentResponseUncheckedUpdateWithoutAssessmentInput>
  }

  export type AssessmentResponseUpdateManyWithWhereWithoutAssessmentInput = {
    where: AssessmentResponseScalarWhereInput
    data: XOR<AssessmentResponseUpdateManyMutationInput, AssessmentResponseUncheckedUpdateManyWithoutAssessmentInput>
  }

  export type AssessmentResponseScalarWhereInput = {
    AND?: AssessmentResponseScalarWhereInput | AssessmentResponseScalarWhereInput[]
    OR?: AssessmentResponseScalarWhereInput[]
    NOT?: AssessmentResponseScalarWhereInput | AssessmentResponseScalarWhereInput[]
    id?: StringFilter<"AssessmentResponse"> | string
    assessmentId?: StringFilter<"AssessmentResponse"> | string
    pillarId?: IntFilter<"AssessmentResponse"> | number
    capabilityId?: StringFilter<"AssessmentResponse"> | string
    capabilityName?: StringNullableFilter<"AssessmentResponse"> | string | null
    questionId?: StringFilter<"AssessmentResponse"> | string
    questionText?: StringFilter<"AssessmentResponse"> | string
    answer?: StringFilter<"AssessmentResponse"> | string
    recommendation?: StringNullableFilter<"AssessmentResponse"> | string | null
    whyItMatters?: StringNullableFilter<"AssessmentResponse"> | string | null
    quickWin?: StringNullableFilter<"AssessmentResponse"> | string | null
    supportAvailable?: StringNullableFilter<"AssessmentResponse"> | string | null
    priority?: StringNullableFilter<"AssessmentResponse"> | string | null
    updatedAt?: DateTimeFilter<"AssessmentResponse"> | Date | string
  }

  export type AssessmentCreateWithoutPillarAssessmentsInput = {
    id?: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAssessmentsInput
    assessmentResponses?: AssessmentResponseCreateNestedManyWithoutAssessmentInput
  }

  export type AssessmentUncheckedCreateWithoutPillarAssessmentsInput = {
    id?: string
    userId: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assessmentResponses?: AssessmentResponseUncheckedCreateNestedManyWithoutAssessmentInput
  }

  export type AssessmentCreateOrConnectWithoutPillarAssessmentsInput = {
    where: AssessmentWhereUniqueInput
    create: XOR<AssessmentCreateWithoutPillarAssessmentsInput, AssessmentUncheckedCreateWithoutPillarAssessmentsInput>
  }

  export type AssessmentUpsertWithoutPillarAssessmentsInput = {
    update: XOR<AssessmentUpdateWithoutPillarAssessmentsInput, AssessmentUncheckedUpdateWithoutPillarAssessmentsInput>
    create: XOR<AssessmentCreateWithoutPillarAssessmentsInput, AssessmentUncheckedCreateWithoutPillarAssessmentsInput>
    where?: AssessmentWhereInput
  }

  export type AssessmentUpdateToOneWithWhereWithoutPillarAssessmentsInput = {
    where?: AssessmentWhereInput
    data: XOR<AssessmentUpdateWithoutPillarAssessmentsInput, AssessmentUncheckedUpdateWithoutPillarAssessmentsInput>
  }

  export type AssessmentUpdateWithoutPillarAssessmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAssessmentsNestedInput
    assessmentResponses?: AssessmentResponseUpdateManyWithoutAssessmentNestedInput
  }

  export type AssessmentUncheckedUpdateWithoutPillarAssessmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assessmentResponses?: AssessmentResponseUncheckedUpdateManyWithoutAssessmentNestedInput
  }

  export type AssessmentCreateWithoutAssessmentResponsesInput = {
    id?: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAssessmentsInput
    pillarAssessments?: PillarAssessmentCreateNestedManyWithoutAssessmentInput
  }

  export type AssessmentUncheckedCreateWithoutAssessmentResponsesInput = {
    id?: string
    userId: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pillarAssessments?: PillarAssessmentUncheckedCreateNestedManyWithoutAssessmentInput
  }

  export type AssessmentCreateOrConnectWithoutAssessmentResponsesInput = {
    where: AssessmentWhereUniqueInput
    create: XOR<AssessmentCreateWithoutAssessmentResponsesInput, AssessmentUncheckedCreateWithoutAssessmentResponsesInput>
  }

  export type AssessmentUpsertWithoutAssessmentResponsesInput = {
    update: XOR<AssessmentUpdateWithoutAssessmentResponsesInput, AssessmentUncheckedUpdateWithoutAssessmentResponsesInput>
    create: XOR<AssessmentCreateWithoutAssessmentResponsesInput, AssessmentUncheckedCreateWithoutAssessmentResponsesInput>
    where?: AssessmentWhereInput
  }

  export type AssessmentUpdateToOneWithWhereWithoutAssessmentResponsesInput = {
    where?: AssessmentWhereInput
    data: XOR<AssessmentUpdateWithoutAssessmentResponsesInput, AssessmentUncheckedUpdateWithoutAssessmentResponsesInput>
  }

  export type AssessmentUpdateWithoutAssessmentResponsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAssessmentsNestedInput
    pillarAssessments?: PillarAssessmentUpdateManyWithoutAssessmentNestedInput
  }

  export type AssessmentUncheckedUpdateWithoutAssessmentResponsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pillarAssessments?: PillarAssessmentUncheckedUpdateManyWithoutAssessmentNestedInput
  }

  export type OrderCreateManyUserInput = {
    id?: string
    planType: string
    amount: number
    currency?: string
    paymentMethod: string
    phoneNumber?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type AssessmentCreateManyUserInput = {
    id?: string
    overallScore?: number
    maturityLevel?: string
    pillarScores?: string
    radarData?: string
    priorityAreas?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pillarAssessments?: PillarAssessmentUpdateManyWithoutAssessmentNestedInput
    assessmentResponses?: AssessmentResponseUpdateManyWithoutAssessmentNestedInput
  }

  export type AssessmentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pillarAssessments?: PillarAssessmentUncheckedUpdateManyWithoutAssessmentNestedInput
    assessmentResponses?: AssessmentResponseUncheckedUpdateManyWithoutAssessmentNestedInput
  }

  export type AssessmentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    pillarScores?: StringFieldUpdateOperationsInput | string
    radarData?: StringFieldUpdateOperationsInput | string
    priorityAreas?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PillarAssessmentCreateManyAssessmentInput = {
    id?: string
    pillarId: number
    pillarName: string
    score?: number
    yesCount?: number
    noCount?: number
    totalQuestions?: number
    maturityLevel?: string
    capabilityScores?: string
    isCompleted?: boolean
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type AssessmentResponseCreateManyAssessmentInput = {
    id?: string
    pillarId: number
    capabilityId: string
    capabilityName?: string | null
    questionId: string
    questionText: string
    answer: string
    recommendation?: string | null
    whyItMatters?: string | null
    quickWin?: string | null
    supportAvailable?: string | null
    priority?: string | null
    updatedAt?: Date | string
  }

  export type PillarAssessmentUpdateWithoutAssessmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    pillarName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    yesCount?: IntFieldUpdateOperationsInput | number
    noCount?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    capabilityScores?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PillarAssessmentUncheckedUpdateWithoutAssessmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    pillarName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    yesCount?: IntFieldUpdateOperationsInput | number
    noCount?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    capabilityScores?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PillarAssessmentUncheckedUpdateManyWithoutAssessmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    pillarName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    yesCount?: IntFieldUpdateOperationsInput | number
    noCount?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    maturityLevel?: StringFieldUpdateOperationsInput | string
    capabilityScores?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentResponseUpdateWithoutAssessmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    capabilityId?: StringFieldUpdateOperationsInput | string
    capabilityName?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: StringFieldUpdateOperationsInput | string
    questionText?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    quickWin?: NullableStringFieldUpdateOperationsInput | string | null
    supportAvailable?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentResponseUncheckedUpdateWithoutAssessmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    capabilityId?: StringFieldUpdateOperationsInput | string
    capabilityName?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: StringFieldUpdateOperationsInput | string
    questionText?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    quickWin?: NullableStringFieldUpdateOperationsInput | string | null
    supportAvailable?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentResponseUncheckedUpdateManyWithoutAssessmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    pillarId?: IntFieldUpdateOperationsInput | number
    capabilityId?: StringFieldUpdateOperationsInput | string
    capabilityName?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: StringFieldUpdateOperationsInput | string
    questionText?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    quickWin?: NullableStringFieldUpdateOperationsInput | string | null
    supportAvailable?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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