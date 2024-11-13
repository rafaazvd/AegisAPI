export enum PostgresErrorCode {
  UniqueViolation = 'P2002',
  CheckViolation = '23514',
  NotNullViolation = '23502',
  ForeignKeyViolation = '23503',
}
