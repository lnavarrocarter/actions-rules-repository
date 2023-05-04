const { Octokit } = require("@octokit/rest");
const envs = require('dotenv').config();


const githubToken = process.env.GITHUB_TOKEN;
const githubRepo = process.env.GITHUB_REPOSITORY;
const icons = ['🔥', '💀', '💊'];
const codeblock = '```';
const codesmall = '`';



const octokit = new Octokit({
    auth: githubToken,
});

const main = async () => {
    validateEnvs();
    try {
        let MsgReports = [];
        const [owner, repo] = githubRepo.split('/');
        const branches = await listBranches(owner, repo);
        //branches.map(branch => console.info('Branches Commit: ', branch));
        branches.forEach(async (branch, index) => {
            try {
                const [valid, type] = validateBranchesStructure(branch.name);
                if (!valid) {
                    MsgReports.push(`The branch ${branch.name} does not match the structure`);
                    const labels = "Invalid,Structure,Branch";
                    const commitDetails = await getCommitDetails(owner, repo, branch.commit.sha)
                    delete commitDetails.files;
                    //console.log(commitDetails)

                    await generateIssues(
                        owner,
                        repo,
                        `${icons[1]} ERROR: Structure Branch Name : ${branch.name}`,
                        `The branch ${codesmall} ${branch.name} ${codesmall} does not match the structure please check the branch for this structure:\n\n - feature/branch-name \n - bugfix/branch-name \n - hotfix/branch-name \n - release/1.0.0 \n - chore/branch-name \n - refactor/branch-name \n\n ${icons[2]} **Commit Details:**\n\n${codeblock}json\n${JSON.stringify(commitDetails,2,1)}\n ${codeblock}`,
                        labels,
                        ['lnavarrocarter']
                    )
                    .catch(err => MsgReports.push(`The branch ${branch.name} dont report the issue`))
                } else {
                    //protected branch release main & master
                    if ((type === 'main' || type === 'master') && branch.protected === false) {
                        MsgReports.push(`The branch ${branch.name} is not protected`);
                        const labels = "Protected, Branch, main, master";
                        await setProtectedBranch(owner, repo, branch.name)
                    }
                    //protected branch develop & dev
                    if (type === 'develop' || type === 'dev' && branch.protected === false) {
                        MsgReports.push(`The branch ${branch.name} is not protected`);
                        const labels = "Protected, Branch, main, master";
                        await setProtectedBranch(owner, repo, branch.name)
                    }
                    //protected branch feature
                    if (type === 'release' && branch.protected === false) {
                        MsgReports.push(`The branch ${branch.name} is not protected`);
                        const labels = "Protected, Branch, Release";
                        await setProtectedBranch(owner, repo, branch.name)
                    }
                }
            }catch(err){
                MsgReports.push(`The branch ${branch.name} does not match the structure`);
            }
            console.log(index, branches.length)
            if (index === branches.length - 1) {
                console.error(MsgReports);
            }
        });

    } catch (err) {
        console.error({ err });
    }
}


/**
 * Validate the structure of the branches of a repository
 * @param {*} branchName
 * @return {*} 
 */
const validateBranchesStructure = (branchName) => {
    const regexList = [
        { regex: /^master$/, name: 'master' },
        { regex: /^main$/, name: 'main' },
        { regex: /^develop$/, name: 'develop' },
        { regex: /^dev$/, name: 'dev' },
        { regex: /^feature\/.+$/, name: 'feature' },
        { regex: /^bugfix\/.+$/, name: 'bugfix' },
        { regex: /^hotfix\/.+$/, name: 'hotfix' },
        { regex: /^release\/\d+\.\d+\.\d+$/, name: 'release' },
        { regex: /^chore\/.+$/, name: 'chore' },
        { regex: /^refactor\/.+$/, name: 'refactor' },
    ];

    for (const item of regexList) {
        if (item.regex.test(branchName)) {
            return [true, item.name];
        }
    }

    return [false, null];

};

/**
 * Get the details of a commit with repository, owner and sha
 * @param {*} owner
 * @param {*} repo
 * @param {*} sha
 * @return {*} 
 */
const getCommitDetails = async (owner, repo, sha) => {
    const { data } = await octokit.repos.getCommit({
        owner,
        repo,
        ref: sha,
    });
    return data;
};

const assigmentLabels = async (owner, repo, number, labels) => {
    const { data } = await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: number,
        labels: labels.split(','),
    });
    return data;
};

/**
 * Create a new issue in a repository with the given title and body
 * @param {string} owner
 * @param {string} repo
 * @param {string} title
 * @param {string} body
 * @param {string,string} labels
 * @param {[string]} assign
 * @return {*} 
 */
const generateIssues = async (owner, repo, title, body, labels, assign) => {
    const { data } = await octokit.issues.create({
        owner,
        repo,
        title,
        body,
        assignees: assign,
        labels: labels.split(',')
    });
    return data;
};

/**
 * List all branches of a repository
 * @param {*} owner
 * @param {*} repo
 * @return {*} 
 */
const listBranches = async (owner, repo) => {
    const { data } = await octokit.repos.listBranches({
        owner,
        repo,
    });
    return data;
};

/**
 * Set protected branch of a repository
 * @param {*} owner
 * @param {*} repo
 * @param {*} branch
 * @return {*} 
 */
const setProtectedBranch = async (owner, repo, branch) => {
    const { data } = await octokit.repos.updateBranchProtection({
        owner,
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
};

/**
 *Validate ENV variables
 *
 */
const validateEnvs = () => {
    if (!githubToken) throw new Error('GITHUB_TOKEN is required');
    if (!githubRepo) throw new Error('GITHUB_REPOSITORY is required');
};

//Execute the main function
main();
