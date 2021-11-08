const debug_log = (msg, arg) => {
    /// Get terminal size
    const x =  process.stdout.columns;
    const y =  process.stdout.rows;
    //// Log with 
    console.log('     ' + '-'.repeat(x-5));
    console.log('     ' + '- '+ msg, arg);
    console.log('     ' + '-'.repeat(x-5));
  }
  module.exports = debug_log;