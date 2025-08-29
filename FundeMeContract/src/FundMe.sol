// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundMe {
 struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        mapping(address => uint256) donations;
        address[] donators;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(string memory _title, string memory _description, uint256 _target, uint256 _deadline) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "Deadline should be in the future");

        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp < campaign.deadline, "Campaign has ended");
        
        campaign.donations[msg.sender] += msg.value;
        campaign.donators.push(msg.sender);
        campaign.amountCollected += msg.value;
    }

    function withdraw(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];

        require(msg.sender == campaign.owner, "Only the campaign owner can withdraw funds");
        require(campaign.amountCollected >= campaign.target, "Target amount not reached");
        require(block.timestamp > campaign.deadline, "Campaign has not ended yet");

        uint256 amount = campaign.amountCollected;
        campaign.amountCollected = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_id];
        
        address[] memory _donators = campaign.donators;
        uint256[] memory _donations = new uint256[](_donators.length);

        for(uint256 i = 0; i < _donators.length; i++) {
            _donations[i] = campaign.donations[_donators[i]];
        }

        return (_donators, _donations);
    }

    function getCampaign(uint256 _id) view public returns (
        address owner,
        string memory title,
        string memory description,
        uint256 target,
        uint256 deadline,
        uint256 amountCollected
    ) {
        Campaign storage campaign = campaigns[_id];

        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.target,
            campaign.deadline,
            campaign.amountCollected
        );
    }


    function getAllCampaigns() public view returns (
        address[] memory,
        string[] memory,
        string[] memory,
        uint256[] memory,
        uint256[] memory,
        uint256[] memory
    ) {
        address[] memory owners = new address[](numberOfCampaigns);
        string[] memory titles = new string[](numberOfCampaigns);
        string[] memory descriptions = new string[](numberOfCampaigns);
        uint256[] memory targets = new uint256[](numberOfCampaigns);
        uint256[] memory deadlines = new uint256[](numberOfCampaigns);
        uint256[] memory amountsCollected = new uint256[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            owners[i] = campaign.owner;
            titles[i] = campaign.title;
            descriptions[i] = campaign.description;
            targets[i] = campaign.target;
            deadlines[i] = campaign.deadline;
            amountsCollected[i] = campaign.amountCollected;
        }

        return (owners, titles, descriptions, targets, deadlines, amountsCollected);
    }
}