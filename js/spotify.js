
$(function() {

const api_adress = "https://spotify-api-wrapper.appspot.com";

$(".btn").on("click", getArtistInformation);

$(".search-field").keyup(function(e) {
    if (e.which === 13){
        $(".btn").click();
    }
});

    function getArtistInformation() {

        let artistQuery = $(".search-field").val();
        $(".error-container").text("")

        if(artistQuery !== ""){
            $(".search-field").val("");

            fetch(api_adress + "/artist/" + artistQuery)
            .then(response => response.json())
            .then(data => {
                let artist = (data.artists.items[0]);

                $(".titel").text(artist.name);
                $(".image").attr("src", artist.images[0].url);

                let tracksEndPoints = api_adress + "/artist/" + artist.id + "/top-tracks";

                fetch(tracksEndPoints)
                .then(response => response.json())
                .then(data => { 
                    $(".artist-track").remove();
                    $(".top-tracks").text(artist.name + " - 10 top tracks");

                    data.tracks.forEach(function(track) {
                        let audio = new Audio(track.preview_url);
                            audio.setAttribute("controls", true);
                            let errorMessage = $("<span class='error-song'>").text("");

                            if(track.preview_url === null){
                             errorMessage = $("<span class='error-song'>").text("CANT FIND AUDIO TRACK");
                            }

                        let trackDiv = $("<div class='artist-track'>").text(track.name).append(errorMessage).appendTo($(".artist-track-container"));
                        $(audio).appendTo(trackDiv);

                        $(audio).on({
                            play: function() {
                                pauseActiveTrack();
                                $(this).parent().addClass("active");
                            },
                            pause: function() {
                                $(this).parent().removeClass("active");                
                            }  
                        })
                    })
                })
            })
            .catch(error => {
                $(".error-container").append($("<div class='error-text'>").text("Could not find artist"));
            });
        } else {
            $(".error-container").append($("<div class='error-text'>").text("Please type something to find artists"));
        }
    }

    function pauseActiveTrack(){
        $("audio").each(function () {
            if($(this).parent().hasClass("active")){
                this.pause();
            }
        });
    }

})

