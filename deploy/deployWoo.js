// Woo 토큰 배포 스크립트
module.exports = async ({ deployments, getNamedAccounts }) => {

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const WOO = await deploy("Woo", { from: deployer, log: true });
}

module.exports.tags = ['WOO'];