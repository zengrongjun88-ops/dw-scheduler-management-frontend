/**
 * 数据源Mock数据
 * 10个数据源
 */

export interface MockDatasource {
  id: number;
  name: string;
  type: 'MYSQL' | 'HIVE' | 'CLICKHOUSE' | 'POSTGRESQL' | 'ORACLE' | 'KAFKA' | 'REDIS';
  host: string;
  port: number;
  database: string;
  username: string;
  status: 'ONLINE' | 'OFFLINE';
  description: string;
  createTime: string;
  updateTime: string;
}

export const mockDatasources: MockDatasource[] = [
  {
    id: 1,
    name: 'mysql_source',
    type: 'MYSQL',
    host: 'mysql-master.company.com',
    port: 3306,
    database: 'business_db',
    username: 'root',
    status: 'ONLINE',
    description: 'MySQL主库-业务数据源',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-20 15:00:00',
  },
  {
    id: 2,
    name: 'hive_warehouse',
    type: 'HIVE',
    host: 'hive-server.company.com',
    port: 10000,
    database: 'default',
    username: 'hive',
    status: 'ONLINE',
    description: 'Hive数据仓库',
    createTime: '2024-01-01 10:05:00',
    updateTime: '2024-01-20 15:05:00',
  },
  {
    id: 3,
    name: 'clickhouse_olap',
    type: 'CLICKHOUSE',
    host: 'clickhouse.company.com',
    port: 9000,
    database: 'olap',
    username: 'default',
    status: 'ONLINE',
    description: 'ClickHouse分析库',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-20 15:10:00',
  },
  {
    id: 4,
    name: 'postgres_metadata',
    type: 'POSTGRESQL',
    host: 'postgres.company.com',
    port: 5432,
    database: 'metadata',
    username: 'postgres',
    status: 'ONLINE',
    description: 'PostgreSQL元数据库',
    createTime: '2024-01-02 10:05:00',
    updateTime: '2024-01-20 15:15:00',
  },
  {
    id: 5,
    name: 'oracle_erp',
    type: 'ORACLE',
    host: 'oracle.company.com',
    port: 1521,
    database: 'ORCL',
    username: 'system',
    status: 'ONLINE',
    description: 'Oracle ERP系统',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-20 15:20:00',
  },
  {
    id: 6,
    name: 'kafka_stream',
    type: 'KAFKA',
    host: 'kafka-broker-1.company.com:9092,kafka-broker-2.company.com:9092',
    port: 9092,
    database: '',
    username: '',
    status: 'ONLINE',
    description: 'Kafka消息队列',
    createTime: '2024-01-03 10:05:00',
    updateTime: '2024-01-20 15:25:00',
  },
  {
    id: 7,
    name: 'redis_cache',
    type: 'REDIS',
    host: 'redis.company.com',
    port: 6379,
    database: '0',
    username: 'default',
    status: 'ONLINE',
    description: 'Redis缓存',
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-20 15:30:00',
  },
  {
    id: 8,
    name: 'mysql_report',
    type: 'MYSQL',
    host: 'mysql-report.company.com',
    port: 3306,
    database: 'report_db',
    username: 'report_user',
    status: 'ONLINE',
    description: 'MySQL报表库',
    createTime: '2024-01-04 10:05:00',
    updateTime: '2024-01-20 15:35:00',
  },
  {
    id: 9,
    name: 'hive_ods',
    type: 'HIVE',
    host: 'hive-server.company.com',
    port: 10000,
    database: 'ods',
    username: 'hive',
    status: 'ONLINE',
    description: 'Hive ODS层',
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-20 15:40:00',
  },
  {
    id: 10,
    name: 'mysql_backup',
    type: 'MYSQL',
    host: 'mysql-backup.company.com',
    port: 3306,
    database: 'backup_db',
    username: 'backup_user',
    status: 'OFFLINE',
    description: 'MySQL备份库(已下线)',
    createTime: '2024-01-05 10:05:00',
    updateTime: '2024-01-20 15:45:00',
  },
];
