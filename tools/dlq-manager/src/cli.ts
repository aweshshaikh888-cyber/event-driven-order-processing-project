import { Command } from 'commander';
import { DlqService } from './dlq-service';

const program = new Command();
const dlqService = new DlqService();

program
  .name('dlq-manager')
  .description('Dead Letter Queue (DLQ) Inspector and Message Replay Tool')
  .version('1.0.0');

program
  .command('inspect')
  .description('Inspect all failed/poisoned messages stored in the DLQ topic')
  .option('-n, --limit <number>', 'Maximum number of messages to fetch', '20')
  .action(async (options) => {
    try {
      console.log('🔍 Fetching DLQ messages from topic: order-processing.dlq ...');
      const messages = await dlqService.inspectMessages(parseInt(options.limit, 10));

      if (messages.length === 0) {
        console.log('✅ Dead Letter Queue is empty! No failed messages.');
        process.exit(0);
      }

      console.log(`\n📦 Found ${messages.length} message(s) in DLQ:`);
      console.table(
        messages.map((m) => ({
          Key: m.key,
          OriginTopic: m.originalTopic,
          Error: m.errorReason,
          FailedAt: m.failedAt,
          Offset: m.offset,
        }))
      );
      process.exit(0);
    } catch (err: any) {
      console.error('❌ Error inspecting DLQ:', err.message);
      process.exit(1);
    }
  });

program
  .command('replay')
  .description('Replay messages from the DLQ back to their original target topics')
  .option('-k, --key <string>', 'Replay specific message key only')
  .action(async (options) => {
    try {
      console.log('🔁 Replaying messages from DLQ...');
      const res = await dlqService.replayMessages(options.key);
      console.log(`✅ Successfully replayed ${res.replayedCount} message(s) back to original topics.`);
      process.exit(0);
    } catch (err: any) {
      console.error('❌ Error replaying DLQ:', err.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
