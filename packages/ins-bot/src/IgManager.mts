import {
    IgApiClient,
    type PostingPhotoOptions,
} from 'instagram-private-api';

class IgManager {
    constructor(
        private username: string,
        private password: string,
    ) {
    }

    async login() {
        this.igClient.state.generateDevice(this.username);

        // await this.igClient.simulate.preLoginFlow();
        await this.igClient.account.login(this.username, this.password);

        this.loggedIn = true;
    }

    async publishPhoto(options: PostingPhotoOptions) {
        this.checkLoginStatus();

        await this.igClient.publish.photo(options);
    }

    private checkLoginStatus(): void | never {
        if (!this.loggedIn) {
            throw new Error('[IgApiClient]: Cannot publish anything before logging in');
        }
    }

    private loggedIn = false;
    private igClient = new IgApiClient();
}

export default IgManager;
