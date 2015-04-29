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
				      "</ul><button id='write'>Write File</button>" +
				      "<input type='text'id='text'/> " +
				      "<li>Files:<ul id='list_files'></ul></li></ul>");
			
			$("#write").click(writeRepo);
			listFiles();
	    }
	});
    
};

function listFiles() {
    repo.contents('master', '', function(error, contents) {
        var repoList = $("#list_files");
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
                "</li>");
         }
    });
};

function writeRepo() {
    repo.write('master', 'datafile', 
		 $("#text").val(),
		 "Appending Text", function(err) {
		     console.log (err)
		 });
    	$("#newForm").append("<h2>Success!!</h2>");
};

function signIn(){
	access = hello("github");
    access.login({response_type: 'code'}).then( function(){
		getToken();
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
