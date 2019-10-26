// Created by: BennyYasuo, 2019.03.16

class Constants {
    constructor() {
		
		this.prefix = "!";
				
		this.discordPrefix = "k!";

		this.botUser = "";
        
		this.botOAuth = "";
        
		this.clientID = "";
			
		this.discordToken = "";

		this.channels = [""];
		
		this.tmiOptions = {
					options: {
							debug: true
					},
					connection: {
							reconnect: true
					},
					identity: {
							username: this.botUser,
							password: this.botOAuth
					},
					channels: this.channels
			};

    }
}

module.exports = new Constants();