var repo;
var ghObj;

var newForm = "<input type='text'id='user' />" +
    "<input type='text' id='repo' />" +
    "<button type='button' id='dataButton'>Write Data</button>" ;


function readToken(){
	$("#newForm").html("");
	auth = hello("github").getAuthResponse();
	token = auth.access_token;
	
	ghObj = new Github({
		token: token,
		auth: "oauth"
    });

	$("#newForm").append(newForm);
	$("#dataButton").click(getData);
};

function getData(){
	console.log($("user").val());
	console.log($("repo").val());
	repo = ghObj.getRepo($("#user").val(), $("#repo").val());
	repo.show(function(error,repo){
		if (error) {
			$("#newForm").append("<h3>Error: " + error.error + "</h3>");
	    } else {
			$("#newForm").append("<p>Repo data:</p>" +
				      "<ul><li>Full name: " + repo.full_name + "</li>" +
				      "<li>Description: " + repo.description + "</li>" +
				      "<li>Created at: " + repo.created_at + "</li>" +
				      "</ul><div id='files'></div>");
			files();
	    }
	});
    
};

function files() {
    repo.contents('master', '', function(error, contents) {
        var repoList = $("#files");
        if (error) {
            repoList.html("<p>Error code: " + error.error + "</p>");
        } else {
            var files = [];
            var len = contents.length;
            for (var i = 0; i < len; i++) {
                files.push(contents[i].name);
            }
            repoList.html("<li>" + 
                files.join("</li><li>") +
                "</li>"+
                "</li></ul>" +
				  "<div id='readwrite'>" +
				  "<input type='text' name='filename' " +
				  "id='filename' size='20' />" +
				  "<button type='button' id='write'>" +
				  "Write File!</button>" +
				  "<button type='button' id='read'>" +
				  "Read File!</button>" +
				  "<textarea name='content' " +
				  "id='content' rows='4' cols='40'><br>" +
				  "</textarea></div>");
            $("#files li").click(selectFile);
			$("#write").click(writeFile);
			$("#read").click(readFile);
         }
    });
}

function selectFile() {
    element = $(this);
    $("#filename").val(element.text());
};

function writeFile() {

    repo.write('master', $("#filename").val(),
    		 $("#content").val(),
		 "Using Github API", function(err) {
		     console.log (err);
		 });
};

function readFile() {

    repo.read('master', $("#filename").val(), function(err, data) {
		$("#content").val(data);
    });
};

function signIn(){
	access = hello("github");
    access.login({response_type: 'code'}).then( function(){
		readToken();
    }, function( e ){
		alert('Signin error: ' + e.error.message);
    });
}

$(document).ready(function() {

	hello.init({
		github : "cd7198e82aa5a52743ce"
    },{
		redirect_uri : 'redirect.html',
		oauth_proxy : "https://auth-server.herokuapp.com/proxy",
		scope : "publish_files",
    });

    signIn();

    
});
