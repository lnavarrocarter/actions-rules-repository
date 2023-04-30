const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: process.env.GITHUBTOKEN,
});

const main = async () => {
    //restinger all repositories
    // all pull request must be approved by one code owner
    // all pull request must have a review
    //const User = await getUserInfomation();
    //console.log(User, 'User')
    const repositories = await listRepositories();
    repositories.map(async (repo) => {
        console.log(repo.name, 'repo')
    });

}

const getUserInfomation = async () => {
    const { data } = await octokit.users.getAuthenticated();
    return data;
};

const listRepositories = async () => {
    const { data } = await octokit.repos.listForAuthenticatedUser();
    return data;
}

const changeRepositoryVisibility = async (repo, visibility) => {
    const { data } = await octokit.repos.update({
        owner: 'user',
        repo,
        private: visibility,
    });
    return data;
}

const restringeRepository = async (repo) => {
    const { data } = await octokit.repos.update({
        owner: 'user',
        repo,
        private: true,
    });
    return data;
}

const restringebranch = async (repo, branch) => {
    const { data } = await octokit.repos.updateBranchProtection({
        owner: 'user',
        repo,
        branch,
        required_status_checks: true,
        enforce_admins: true,
        required_pull_request_reviews: {
            dismissal_restrictions: null,
            dismiss_stale_reviews: true,
            require_code_owner_reviews: true,
            required_approving_review_count: 1,
        },
        restrictions: null,
    });
    return data;
}


main();
