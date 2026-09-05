
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.1
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.1",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  passwordHash: 'passwordHash',
  phone: 'phone',
  farmName: 'farmName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FarmerProfileScalarFieldEnum = {
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

exports.Prisma.FarmManagementScalarFieldEnum = {
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

exports.Prisma.OperatingStyleScalarFieldEnum = {
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

exports.Prisma.DigitalPlatformScalarFieldEnum = {
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

exports.Prisma.AspirationScalarFieldEnum = {
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

exports.Prisma.OrderScalarFieldEnum = {
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

exports.Prisma.AssessmentScalarFieldEnum = {
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

exports.Prisma.PillarAssessmentScalarFieldEnum = {
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

exports.Prisma.AssessmentResponseScalarFieldEnum = {
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

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
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

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
