
let file_data = {};

module.exports = {getFileData: () => file_data,
    setFileData: (data) => {
      file_data = data;
    //   try{fs.promises.writeFile("./savestate.json",JSON.stringify(data));
    // }catch(ex){
    //     console.log("file_data:  error while saving file_data")
    // }
    }}