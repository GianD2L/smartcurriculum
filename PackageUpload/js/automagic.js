var textbookObj = {};
var filetypeDone = false;
var filedataDone = false;

function onChange(event) {
	if(event.target.files[0] !== undefined) {
		var reader = new FileReader();
		reader.onload = onReaderLoad;
		reader.readAsText(event.target.files[0]);
	}
}

function onReaderLoad(event){
	var obj = JSON.parse(event.target.result);
	textbookObj = obj;
	filedataDone = true;
	processTextbook();
}


$('[type="file"]').ezdz({
  
	text: 'Import Textbook',
	
	accept: function(file, errors) {
		filetypeDone = true;
		processTextbook();
	},
	
	reject: function(file, errors) {
		if (errors.mimeType) {
			alert(file.name + ' is not a valid Textbook Import package');
		}
	}
});


function processTextbook() {
	if(filetypeDone && filedataDone) {
		console.log(textbookObj);	
	}
	
}



document.getElementById('file').addEventListener('change', onChange);
