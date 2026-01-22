/**
 * 日志Mock数据
 */

export const mockLogTemplates = {
  SQL: [
    '========== Task Start ==========',
    'Task ID: {taskId}',
    'Instance ID: {instanceId}',
    'Start Time: {startTime}',
    '-------------------------------',
    'Connecting to Hive server...',
    'Connection established: hive://hive-server.company.com:10000',
    'Executing SQL query...',
    '-------------------------------',
    '{sqlQuery}',
    '-------------------------------',
    'Query submitted, waiting for result...',
    'Map progress: 25%',
    'Map progress: 50%',
    'Map progress: 75%',
    'Map progress: 100%',
    'Reduce progress: 25%',
    'Reduce progress: 50%',
    'Reduce progress: 75%',
    'Reduce progress: 100%',
    'Query completed successfully',
    'Rows affected: {rowCount}',
    'Duration: {duration} seconds',
    '========== Task End ==========',
  ],
  SHELL: [
    '========== Task Start ==========',
    'Task ID: {taskId}',
    'Instance ID: {instanceId}',
    'Start Time: {startTime}',
    'Executor: {executor}',
    '-------------------------------',
    'Executing shell script...',
    '{shellOutput}',
    '-------------------------------',
    'Script executed successfully',
    'Exit code: 0',
    'Duration: {duration} seconds',
    '========== Task End ==========',
  ],
  PYTHON: [
    '========== Task Start ==========',
    'Task ID: {taskId}',
    'Instance ID: {instanceId}',
    'Start Time: {startTime}',
    'Python version: 3.8.10',
    '-------------------------------',
    'Loading dependencies...',
    'Importing modules: pandas, numpy, sklearn',
    'Modules loaded successfully',
    'Running Python script...',
    '{pythonOutput}',
    '-------------------------------',
    'Script completed successfully',
    'Duration: {duration} seconds',
    '========== Task End ==========',
  ],
  FAILED: [
    '========== Task Start ==========',
    'Task ID: {taskId}',
    'Instance ID: {instanceId}',
    'Start Time: {startTime}',
    '-------------------------------',
    '{errorSteps}',
    'ERROR: {errorMsg}',
    'Stack trace:',
    '  at line 45 in process_data()',
    '  at line 120 in main()',
    '-------------------------------',
    'Task failed with exit code 1',
    '========== Task End ==========',
  ],
};

export function generateTaskLog(
  instanceId: number,
  taskId: number,
  taskType: 'SQL' | 'SHELL' | 'PYTHON',
  status: 'SUCCESS' | 'FAILED',
  duration: number
): string[] {
  const template = status === 'FAILED' 
    ? mockLogTemplates.FAILED 
    : mockLogTemplates[taskType];
  
  const startTime = new Date(Date.now() - duration * 1000).toISOString();
  const rowCount = Math.floor(Math.random() * 1000000) + 1000;
  
  const sqlQuery = 'INSERT OVERWRITE TABLE dwd.user_behavior\\nSELECT * FROM ods.user_behavior_log\\nWHERE dt = "20240120"';
  const shellOutput = 'Copying files...\\nProcessing data...\\n5000 files processed';
  const pythonOutput = 'Loading dataset: 1000000 rows\\nTraining model...\\nModel accuracy: 0.8543';
  const errorMsg = status === 'FAILED' 
    ? 'Connection timeout after 30 seconds' 
    : '';
  const errorSteps = 'Connecting to database...\\nExecuting query...\\nWaiting for response...';
  
  return template.map(line => 
    line
      .replace('{taskId}', taskId.toString())
      .replace('{instanceId}', instanceId.toString())
      .replace('{startTime}', startTime)
      .replace('{duration}', duration.toString())
      .replace('{rowCount}', rowCount.toString())
      .replace('{sqlQuery}', sqlQuery)
      .replace('{shellOutput}', shellOutput)
      .replace('{pythonOutput}', pythonOutput)
      .replace('{errorMsg}', errorMsg)
      .replace('{errorSteps}', errorSteps)
      .replace('{executor}', 'worker-1.company.com')
  );
}
