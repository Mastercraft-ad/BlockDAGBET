// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PredictionMarket {
    struct Market {
        string question;
        uint256 deadline;
        address creator;
        bool isResolved;
        bool outcome;
        uint256 totalYesBets;
        uint256 totalNoBets;
        uint256 yesPool;
        uint256 noPool;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    Market[] public markets;

    mapping(uint256 => mapping(address => uint256)) public userYesBets;
    mapping(uint256 => mapping(address => uint256)) public userNoBets;

    event MarketCreated(uint256 indexed marketId, string question, uint256 deadline, address creator);
    event BetPlaced(uint256 indexed marketId, address indexed user, bool choice, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event WinningsClaimed(uint256 indexed marketId, address indexed user, uint256 amount);

    // Create a new prediction market
    function createMarket(string memory question, uint256 deadline) external payable returns (uint256) {
        require(deadline > block.timestamp, "Deadline must be in the future");

        markets.push(Market({
            question: question,
            deadline: deadline,
            creator: msg.sender,
            isResolved: false,
            outcome: false,
            totalYesBets: 0,
            totalNoBets: 0,
            yesPool: 0,
            noPool: 0,
            createdAt: block.timestamp,
            resolvedAt: 0
        }));

        uint256 marketId = markets.length - 1;
        emit MarketCreated(marketId, question, deadline, msg.sender);
        return marketId;
    }

    // Place a bet (YES / NO)
    function placeBet(uint256 marketId, bool choice) external payable {
        require(marketId < markets.length, "Invalid market ID");
        Market storage m = markets[marketId];
        require(block.timestamp < m.deadline, "Market closed");
        require(msg.value > 0, "Must bet > 0");

        if (choice) {
            m.totalYesBets += msg.value;
            m.yesPool += msg.value;
            userYesBets[marketId][msg.sender] += msg.value;
        } else {
            m.totalNoBets += msg.value;
            m.noPool += msg.value;
            userNoBets[marketId][msg.sender] += msg.value;
        }

        emit BetPlaced(marketId, msg.sender, choice, msg.value);
    }

    // Resolve market (only creator can resolve)
    function resolveMarket(uint256 marketId, bool outcome) external {
        require(marketId < markets.length, "Invalid market ID");
        Market storage m = markets[marketId];
        require(msg.sender == m.creator, "Only creator can resolve");
        require(!m.isResolved, "Already resolved");

        m.isResolved = true;
        m.outcome = outcome;
        m.resolvedAt = block.timestamp;

        emit MarketResolved(marketId, outcome);
    }

    // Claim winnings
    function redeem(uint256 marketId) external {
        require(marketId < markets.length, "Invalid market ID");
        Market storage m = markets[marketId];
        require(m.isResolved, "Not resolved yet");

        uint256 payout = 0;
        if (m.outcome) {
            // YES wins
            uint256 userBet = userYesBets[marketId][msg.sender];
            require(userBet > 0, "No winning bet");
            payout = (userBet * (m.yesPool + m.noPool)) / m.totalYesBets;
            userYesBets[marketId][msg.sender] = 0;
        } else {
            // NO wins
            uint256 userBet = userNoBets[marketId][msg.sender];
            require(userBet > 0, "No winning bet");
            payout = (userBet * (m.yesPool + m.noPool)) / m.totalNoBets;
            userNoBets[marketId][msg.sender] = 0;
        }

        payable(msg.sender).transfer(payout);
        emit WinningsClaimed(marketId, msg.sender, payout);
    }

    // View: Get single market details
    function getMarket(uint256 marketId) external view returns (
        string memory question,
        uint256 deadline,
        address creator,
        bool isResolved,
        bool outcome,
        uint256 totalYesBets,
        uint256 totalNoBets,
        uint256 yesPool,
        uint256 noPool,
        uint256 createdAt,
        uint256 resolvedAt
    ) {
        require(marketId < markets.length, "Invalid market ID");
        Market memory m = markets[marketId];
        return (
            m.question,
            m.deadline,
            m.creator,
            m.isResolved,
            m.outcome,
            m.totalYesBets,
            m.totalNoBets,
            m.yesPool,
            m.noPool,
            m.createdAt,
            m.resolvedAt
        );
    }

    // View: Get total number of markets
    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }

    // View: Get user bets for a specific market
    function getUserBets(address user, uint256 marketId) external view returns (uint256 yesBets, uint256 noBets) {
        yesBets = userYesBets[marketId][user];
        noBets = userNoBets[marketId][user];
    }

    // View: Check if user can claim + payout amount
    function canClaim(address user, uint256 marketId) external view returns (bool, uint256) {
        if (marketId >= markets.length) return (false, 0);
        Market memory m = markets[marketId];
        if (!m.isResolved) return (false, 0);

        uint256 payout = 0;
        if (m.outcome && userYesBets[marketId][user] > 0) {
            payout = (userYesBets[marketId][user] * (m.yesPool + m.noPool)) / m.totalYesBets;
            return (true, payout);
        }
        if (!m.outcome && userNoBets[marketId][user] > 0) {
            payout = (userNoBets[marketId][user] * (m.yesPool + m.noPool)) / m.totalNoBets;
            return (true, payout);
        }
        return (false, 0);
    }
}
