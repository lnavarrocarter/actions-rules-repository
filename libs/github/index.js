const { Octokit } = require("@octokit/rest");
const envs = require('dotenv').config();


const githubToken = process.env.GITHUB_TOKEN;
const octokit = new Octokit({
    auth: githubToken,
}); 

const main = async () => {
    const [owner, repo] = core.getInput('repo').split('/');
    /*const branchconfig = await restringebranch(owner, repo)
    .catch(err => console.log({err}));
    console.log(branchconfig);*/
    console.log('This is a Repo & owner $1 $2', owner, repo);
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

const getBranchesProtected = async (user, repo, branch) => {
    const { data } = await octokit.repos.getBranchProtection({
        owner: user,
        repo,
        branch: branch,
    });
    return data;
};

const restringebranch = async (user,repo, branch) => {
    const branchProtected = await getBranchesProtected(user, repo, branch)
    .catch(err => console.error({err}));


    const { data } = await octokit.repos.updateBranchProtection({
        owner: user,
        repo,
        branch,
        required_status_checks: {
            strict: false,
            contexts: []
        },
        enforce_admins: true,
        required_pull_request_reviews: {
            dismissal_restrictions: {
                users: [
                    "omitempty"
                ],
                teams: [
                    'omitempty'
                ]
            },
            dismiss_stale_reviews: true,
            require_code_owner_reviews: true,
            required_approving_review_count: 1,
            require_last_push_approval: true,
        },
        restrictions: {
            users: [],
            teams: [
                '360'
            ],
            apps: []
        },
        required_linear_history: false,
        allow_force_pushes: false,
        allow_deletions: false,
        block_creations: false,
        required_conversation_resolution: true,
        lock_branch: false,
        allow_fork_syncing: false,
    });
    return data;
}


main();
