/**
 * 任务Mock数据
 * 30个任务,包含SQL/Shell/Python类型
 */

export interface MockTask {
  id: number;
  taskName: string;
  taskType: 'SQL' | 'SHELL' | 'PYTHON';
  taskCode: string;
  directoryId: number;
  status: 'ENABLED' | 'DISABLED';
  owner: string;
  cronExpr: string;
  timeout: number;
  retryTimes: number;
  description: string;
  createTime: string;
  updateTime: string;
}

export const mockTasks: MockTask[] = [
  // ODS层任务
  {
    id: 1,
    taskName: 'ods_user_behavior_log',
    taskType: 'SQL',
    taskCode: `-- 用户行为日志ODS层
INSERT OVERWRITE TABLE ods.user_behavior_log PARTITION(dt='\${yyyyMMdd-1}')
SELECT
  user_id,
  event_type,
  product_id,
  event_time,
  platform,
  city
FROM mysql_source.user_behavior
WHERE DATE(event_time) = '\${yyyyMMdd-1}'`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'zhangsan@company.com',
    cronExpr: '0 0 2 * * ?',
    timeout: 3600,
    retryTimes: 3,
    description: '用户行为日志数据采集',
    createTime: '2024-01-10 10:00:00',
    updateTime: '2024-01-15 14:30:00',
  },
  {
    id: 2,
    taskName: 'ods_order_info',
    taskType: 'SQL',
    taskCode: `-- 订单信息ODS层
INSERT OVERWRITE TABLE ods.order_info PARTITION(dt='\${yyyyMMdd-1}')
SELECT
  order_id,
  user_id,
  product_id,
  amount,
  status,
  order_time
FROM mysql_source.orders
WHERE DATE(order_time) = '\${yyyyMMdd-1}'`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'zhangsan@company.com',
    cronExpr: '0 10 2 * * ?',
    timeout: 3600,
    retryTimes: 3,
    description: '订单信息数据采集',
    createTime: '2024-01-10 10:05:00',
    updateTime: '2024-01-15 14:35:00',
  },
  {
    id: 3,
    taskName: 'ods_product_info',
    taskType: 'SQL',
    taskCode: `-- 商品信息ODS层（全量）
INSERT OVERWRITE TABLE ods.product_info
SELECT
  product_id,
  product_name,
  category_id,
  category_name,
  price,
  stock,
  status,
  update_time
FROM mysql_source.products`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'lisi@company.com',
    cronExpr: '0 0 1 * * ?',
    timeout: 1800,
    retryTimes: 2,
    description: '商品信息全量采集',
    createTime: '2024-01-10 10:10:00',
    updateTime: '2024-01-15 14:40:00',
  },
  {
    id: 4,
    taskName: 'ods_user_profile',
    taskType: 'SQL',
    taskCode: `-- 用户画像ODS层（增量）
INSERT INTO TABLE ods.user_profile
SELECT
  user_id,
  nickname,
  gender,
  age,
  city,
  register_time,
  vip_level
FROM mysql_source.users
WHERE update_time >= '\${yyyyMMddHHmmss-1h}'
  AND update_time < '\${yyyyMMddHHmmss}'`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'lisi@company.com',
    cronExpr: '0 0 */1 * * ?',
    timeout: 1800,
    retryTimes: 3,
    description: '用户画像增量采集',
    createTime: '2024-01-10 10:15:00',
    updateTime: '2024-01-15 14:45:00',
  },

  // DWD层任务
  {
    id: 5,
    taskName: 'dwd_user_behavior',
    taskType: 'SQL',
    taskCode: `-- 用户行为明细层
INSERT OVERWRITE TABLE dwd.user_behavior PARTITION(dt='\${yyyyMMdd-1}')
SELECT
  a.user_id,
  b.nickname,
  b.gender,
  b.city,
  a.event_type,
  a.product_id,
  c.product_name,
  c.category_name,
  a.event_time,
  a.platform
FROM ods.user_behavior_log a
LEFT JOIN ods.user_profile b ON a.user_id = b.user_id
LEFT JOIN ods.product_info c ON a.product_id = c.product_id
WHERE a.dt = '\${yyyyMMdd-1}'`,
    directoryId: 3,
    status: 'ENABLED',
    owner: 'wangwu@company.com',
    cronExpr: '0 0 3 * * ?',
    timeout: 5400,
    retryTimes: 3,
    description: '用户行为明细宽表',
    createTime: '2024-01-11 10:00:00',
    updateTime: '2024-01-16 15:00:00',
  },
  {
    id: 6,
    taskName: 'dwd_order_detail',
    taskType: 'SQL',
    taskCode: `-- 订单明细层
INSERT OVERWRITE TABLE dwd.order_detail PARTITION(dt='\${yyyyMMdd-1}')
SELECT
  a.order_id,
  a.user_id,
  b.nickname,
  b.city,
  b.vip_level,
  a.product_id,
  c.product_name,
  c.category_name,
  a.amount,
  a.status,
  a.order_time
FROM ods.order_info a
LEFT JOIN ods.user_profile b ON a.user_id = b.user_id
LEFT JOIN ods.product_info c ON a.product_id = c.product_id
WHERE a.dt = '\${yyyyMMdd-1}'`,
    directoryId: 3,
    status: 'ENABLED',
    owner: 'wangwu@company.com',
    cronExpr: '0 15 3 * * ?',
    timeout: 5400,
    retryTimes: 3,
    description: '订单明细宽表',
    createTime: '2024-01-11 10:05:00',
    updateTime: '2024-01-16 15:05:00',
  },
  {
    id: 7,
    taskName: 'dwd_pay_detail',
    taskType: 'SQL',
    taskCode: `-- 支付明细层
INSERT OVERWRITE TABLE dwd.pay_detail PARTITION(dt='\${yyyyMMdd-1}')
SELECT
  pay_id,
  order_id,
  user_id,
  pay_amount,
  pay_type,
  pay_status,
  pay_time
FROM ods.payment_log
WHERE dt = '\${yyyyMMdd-1}'
  AND pay_status = 'SUCCESS'`,
    directoryId: 3,
    status: 'ENABLED',
    owner: 'zhaoliu@company.com',
    cronExpr: '0 30 3 * * ?',
    timeout: 3600,
    retryTimes: 3,
    description: '支付明细数据',
    createTime: '2024-01-11 10:10:00',
    updateTime: '2024-01-16 15:10:00',
  },

  // 实时计算任务
  {
    id: 8,
    taskName: 'realtime_user_active',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""实时用户活跃统计"""
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.table import StreamTableEnvironment

def main():
    env = StreamExecutionEnvironment.get_execution_environment()
    t_env = StreamTableEnvironment.create(env)

    # 创建Kafka源表
    t_env.execute_sql("""
        CREATE TABLE user_behavior_source (
            user_id BIGINT,
            event_type STRING,
            event_time TIMESTAMP(3),
            WATERMARK FOR event_time AS event_time - INTERVAL '5' SECOND
        ) WITH (
            'connector' = 'kafka',
            'topic' = 'user_behavior',
            'properties.bootstrap.servers' = 'localhost:9092',
            'format' = 'json'
        )
    """)

    # 计算5分钟滚动窗口活跃用户
    result = t_env.sql_query("""
        SELECT
            TUMBLE_START(event_time, INTERVAL '5' MINUTE) as window_start,
            COUNT(DISTINCT user_id) as active_users
        FROM user_behavior_source
        GROUP BY TUMBLE(event_time, INTERVAL '5' MINUTE)
    """)

    # 输出到MySQL
    result.execute_insert("user_active_rt").wait()

if __name__ == '__main__':
    main()`,
    directoryId: 4,
    status: 'ENABLED',
    owner: 'sunqi@company.com',
    cronExpr: '',
    timeout: 0,
    retryTimes: 5,
    description: '实时用户活跃统计',
    createTime: '2024-01-12 10:00:00',
    updateTime: '2024-01-17 16:00:00',
  },
  {
    id: 9,
    taskName: 'realtime_order_monitor',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""实时订单监控"""
import json
from kafka import KafkaConsumer
from datetime import datetime

def process_order(order):
    """处理订单数据"""
    amount = order.get('amount', 0)
    if amount > 10000:
        # 发送告警
        print(f"[ALERT] 大额订单: {order['order_id']}, 金额: {amount}")

    # 更新实时指标
    update_metrics(order)

def update_metrics(order):
    """更新实时指标到Redis"""
    pass

def main():
    consumer = KafkaConsumer(
        'orders',
        bootstrap_servers=['localhost:9092'],
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )

    for message in consumer:
        order = message.value
        process_order(order)

if __name__ == '__main__':
    main()`,
    directoryId: 4,
    status: 'ENABLED',
    owner: 'sunqi@company.com',
    cronExpr: '',
    timeout: 0,
    retryTimes: 5,
    description: '实时订单监控',
    createTime: '2024-01-12 10:05:00',
    updateTime: '2024-01-17 16:05:00',
  },

  // Shell类型任务
  {
    id: 10,
    taskName: 'hdfs_data_backup',
    taskType: 'SHELL',
    taskCode: `#!/bin/bash
# HDFS数据备份脚本

DATE=$(date -d "-1 day" +%Y%m%d)
SOURCE_PATH="/user/hive/warehouse/dwd.db"
BACKUP_PATH="/backup/dwd/\${DATE}"

echo "开始备份: \${DATE}"
echo "源路径: \${SOURCE_PATH}"
echo "备份路径: \${BACKUP_PATH}"

# 创建备份目录
hadoop fs -mkdir -p \${BACKUP_PATH}

# 执行备份
hadoop distcp \${SOURCE_PATH} \${BACKUP_PATH}

if [ $? -eq 0 ]; then
    echo "备份成功"
    # 删除7天前的备份
    OLD_DATE=$(date -d "-7 day" +%Y%m%d)
    hadoop fs -rm -r /backup/dwd/\${OLD_DATE}
    echo "清理完成"
else
    echo "备份失败"
    exit 1
fi`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 5 * * ?',
    timeout: 7200,
    retryTimes: 2,
    description: 'HDFS数据每日备份',
    createTime: '2024-01-13 10:00:00',
    updateTime: '2024-01-18 17:00:00',
  },
  {
    id: 11,
    taskName: 'log_clean',
    taskType: 'SHELL',
    taskCode: `#!/bin/bash
# 日志清理脚本

LOG_DIR="/var/log/scheduler"
DAYS=30

echo "开始清理\${DAYS}天前的日志..."

find \${LOG_DIR} -name "*.log" -type f -mtime +\${DAYS} -exec rm -f {} \\;

echo "清理完成"

# 压缩最近3天的日志
find \${LOG_DIR} -name "*.log" -type f -mtime -3 -mtime +1 -exec gzip {} \\;

echo "压缩完成"`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 4 * * ?',
    timeout: 1800,
    retryTimes: 1,
    description: '日志文件定期清理',
    createTime: '2024-01-13 10:05:00',
    updateTime: '2024-01-18 17:05:00',
  },

  // 离线报表任务
  {
    id: 12,
    taskName: 'daily_user_report',
    taskType: 'SQL',
    taskCode: `-- 每日用户报表
INSERT OVERWRITE TABLE report.daily_user_report PARTITION(dt='\${yyyyMMdd-1}')
SELECT
  '\${yyyyMMdd-1}' as report_date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(DISTINCT CASE WHEN event_type = 'register' THEN user_id END) as new_users,
  COUNT(*) as total_events,
  COUNT(DISTINCT CASE WHEN event_type = 'purchase' THEN user_id END) as pay_users
FROM dwd.user_behavior
WHERE dt = '\${yyyyMMdd-1}'`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 6 * * ?',
    timeout: 3600,
    retryTimes: 3,
    description: '每日用户数据报表',
    createTime: '2024-01-14 10:00:00',
    updateTime: '2024-01-19 18:00:00',
  },
  {
    id: 13,
    taskName: 'daily_order_report',
    taskType: 'SQL',
    taskCode: `-- 每日订单报表
INSERT OVERWRITE TABLE report.daily_order_report PARTITION(dt='\${yyyyMMdd-1}')
SELECT
  '\${yyyyMMdd-1}' as report_date,
  COUNT(*) as order_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount,
  COUNT(DISTINCT user_id) as order_users,
  COUNT(DISTINCT CASE WHEN status = 'SUCCESS' THEN order_id END) as success_orders
FROM dwd.order_detail
WHERE dt = '\${yyyyMMdd-1}'`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 30 6 * * ?',
    timeout: 3600,
    retryTimes: 3,
    description: '每日订单数据报表',
    createTime: '2024-01-14 10:05:00',
    updateTime: '2024-01-19 18:05:00',
  },
  {
    id: 14,
    taskName: 'daily_product_report',
    taskType: 'SQL',
    taskCode: `-- 每日商品报表
INSERT OVERWRITE TABLE report.daily_product_report PARTITION(dt='\${yyyyMMdd-1}')
SELECT
  '\${yyyyMMdd-1}' as report_date,
  product_id,
  product_name,
  category_name,
  COUNT(DISTINCT user_id) as view_users,
  COUNT(*) as view_count,
  SUM(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) as purchase_count,
  SUM(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) as conversion_rate
FROM dwd.user_behavior
WHERE dt = '\${yyyyMMdd-1}'
GROUP BY product_id, product_name, category_name`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 7 * * ?',
    timeout: 5400,
    retryTimes: 3,
    description: '每日商品分析报表',
    createTime: '2024-01-14 10:10:00',
    updateTime: '2024-01-19 18:10:00',
  },

  // 更多任务 (15-30)
  {
    id: 15,
    taskName: 'weekly_user_retention',
    taskType: 'SQL',
    taskCode: `-- 周留存分析`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 8 ? * MON',
    timeout: 7200,
    retryTimes: 2,
    description: '周留存率分析',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-20 19:00:00',
  },
  {
    id: 16,
    taskName: 'data_quality_check',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# 数据质量检查
print("Quality check passed")`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 9 * * ?',
    timeout: 1800,
    retryTimes: 1,
    description: '数据质量检查任务',
    createTime: '2024-01-15 10:05:00',
    updateTime: '2024-01-20 19:05:00',
  },
  {
    id: 17,
    taskName: 'export_to_mysql',
    taskType: 'SHELL',
    taskCode: `#!/bin/bash
echo "Exporting data..."`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 10 * * ?',
    timeout: 3600,
    retryTimes: 2,
    description: '导出报表到MySQL',
    createTime: '2024-01-15 10:10:00',
    updateTime: '2024-01-20 19:10:00',
  },
  {
    id: 18,
    taskName: 'user_tag_calculate',
    taskType: 'SQL',
    taskCode: `-- 用户标签计算
SELECT * FROM users`,
    directoryId: 3,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 11 * * ?',
    timeout: 7200,
    retryTimes: 3,
    description: '用户标签计算',
    createTime: '2024-01-16 10:00:00',
    updateTime: '2024-01-21 20:00:00',
  },
  {
    id: 19,
    taskName: 'product_recommendation',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# 商品推荐算法
print("Recommendation generated")`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'algorithm@company.com',
    cronExpr: '0 0 12 * * ?',
    timeout: 10800,
    retryTimes: 2,
    description: '商品协同过滤推荐',
    createTime: '2024-01-16 10:05:00',
    updateTime: '2024-01-21 20:05:00',
  },
  {
    id: 20,
    taskName: 'funnel_analysis',
    taskType: 'SQL',
    taskCode: `-- 转化漏斗分析
SELECT * FROM funnel`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 13 * * ?',
    timeout: 3600,
    retryTimes: 3,
    description: '用户转化漏斗分析',
    createTime: '2024-01-17 10:00:00',
    updateTime: '2024-01-22 21:00:00',
  },
  {
    id: 21,
    taskName: 'cohort_analysis',
    taskType: 'SQL',
    taskCode: `-- 群组分析
SELECT * FROM cohort`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 14 * * ?',
    timeout: 5400,
    retryTimes: 2,
    description: '用户群组分析',
    createTime: '2024-01-17 10:05:00',
    updateTime: '2024-01-22 21:05:00',
  },
  {
    id: 22,
    taskName: 'alert_check',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# 指标告警检查
print("Alert check done")`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 */1 * * ?',
    timeout: 900,
    retryTimes: 1,
    description: '业务指标告警检查',
    createTime: '2024-01-17 10:10:00',
    updateTime: '2024-01-22 21:10:00',
  },
  {
    id: 23,
    taskName: 'dimension_table_sync',
    taskType: 'SHELL',
    taskCode: `#!/bin/bash
echo "Syncing dimension tables..."`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 */6 * * ?',
    timeout: 1800,
    retryTimes: 2,
    description: '维度表同步到Redis',
    createTime: '2024-01-18 10:00:00',
    updateTime: '2024-01-22 21:15:00',
  },
  {
    id: 24,
    taskName: 'ab_test_analysis',
    taskType: 'SQL',
    taskCode: `-- AB测试效果分析
SELECT * FROM ab_test`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 15 * * ?',
    timeout: 3600,
    retryTimes: 2,
    description: 'AB测试效果分析',
    createTime: '2024-01-18 10:05:00',
    updateTime: '2024-01-22 21:20:00',
  },
  {
    id: 25,
    taskName: 'elasticsearch_sync',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# 同步数据到ES
print("ES sync completed")`,
    directoryId: 2,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 */2 * * ?',
    timeout: 1800,
    retryTimes: 2,
    description: '商品数据同步到ES',
    createTime: '2024-01-18 10:10:00',
    updateTime: '2024-01-22 21:25:00',
  },
  {
    id: 26,
    taskName: 'user_lifetime_value',
    taskType: 'SQL',
    taskCode: `-- 用户LTV计算
SELECT * FROM ltv`,
    directoryId: 3,
    status: 'ENABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 16 * * ?',
    timeout: 7200,
    retryTimes: 2,
    description: '用户LTV价值计算',
    createTime: '2024-01-19 10:00:00',
    updateTime: '2024-01-22 21:30:00',
  },
  {
    id: 27,
    taskName: 'inventory_alert',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# 库存预警
print("Inventory check done")`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 9,17 * * ?',
    timeout: 1800,
    retryTimes: 1,
    description: '库存预警检查',
    createTime: '2024-01-19 10:05:00',
    updateTime: '2024-01-22 21:35:00',
  },
  {
    id: 28,
    taskName: 'competitor_price_monitor',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# 竞品价格监控
print("Price monitoring done")`,
    directoryId: 5,
    status: 'DISABLED',
    owner: 'analyst@company.com',
    cronExpr: '0 0 */6 * * ?',
    timeout: 3600,
    retryTimes: 1,
    description: '竞品价格监控',
    createTime: '2024-01-19 10:10:00',
    updateTime: '2024-01-22 21:40:00',
  },
  {
    id: 29,
    taskName: 'ml_model_training',
    taskType: 'PYTHON',
    taskCode: `#!/usr/bin/env python3
# ML模型训练
print("Model training completed")`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'algorithm@company.com',
    cronExpr: '0 0 18 ? * SUN',
    timeout: 14400,
    retryTimes: 1,
    description: '用户流失预测模型训练',
    createTime: '2024-01-20 10:00:00',
    updateTime: '2024-01-22 21:45:00',
  },
  {
    id: 30,
    taskName: 'report_email_send',
    taskType: 'SHELL',
    taskCode: `#!/bin/bash
echo "Sending daily report..."`,
    directoryId: 5,
    status: 'ENABLED',
    owner: 'admin@company.com',
    cronExpr: '0 0 20 * * ?',
    timeout: 1800,
    retryTimes: 2,
    description: '每日数据报表邮件',
    createTime: '2024-01-20 10:05:00',
    updateTime: '2024-01-22 21:50:00',
  },
];
