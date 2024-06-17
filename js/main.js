
let proj = new SLProject();

function pick(){
	File.pickBuffer(function(files){
		stdout.value = JSON.stringify(pamDecode(files[0]), null, 4);
	});
}
