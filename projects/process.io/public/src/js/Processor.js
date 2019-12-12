
module.exports = exports = function(data) {
  var dataType = data.length > 0 ? typeof data[0] : null;
  var processes = [],
    processHistory = [];
  function addProcess(process) {
    if (processes.length == 0 && process.inType == "any" ||  process.inType == dataType) {
        return processes.push(process);
    } else if (process.inType == "any" || processes[processes.length-1].outType == process.inType) {
      return processes.push(process);
    }
    throw new Error("Previous process has an incompatible data type\nGot:" + process.inType + " expected " + processes[processes.length-1].outType); 
  }
  function run() {
    processHistory = [Array.from(data)];
    var values = Array.from(data);
    processes.forEach(process => {
      console.log(process, values)
      values.forEach((obj, i) => {
        values[i] = process.run(obj);
      });
      processHistory.push(Array.from(values))
    });
    return values;
  }
  function setData(new_data) {
    data=new_data;
    dataType = data.length > 0 ? typeof data[0] : null;
  }
  function getProcessHistory() {
    return processHistory;
  }
  return { addProcess, setData,run, getProcessHistory };
};
