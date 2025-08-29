// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";

import {FundMe} from "../src/FundMe.sol";

contract FundMeTest is Test {
    FundMe public fundMe;

    function setUp() public {
        fundMe = new FundMe();
    }

    function testCreateCampaign() public {
        uint256 id = fundMe.createCampaign("Test", "Desc", 1 ether, block.timestamp + 1 days);
       (address owner, string memory title, string memory description, uint256 target, uint256 deadline, uint256 amountCollected) = fundMe.getCampaign(id);
        assertEq(owner, address(this));
        assertEq(title, "Test");
        assertEq(description, "Desc");
        assertEq(target, 1 ether);
        assertEq(amountCollected, 0);
    }

    function testDonateToCampaign() public {
        uint256 id = fundMe.createCampaign("Test", "Desc", 1 ether, block.timestamp + 1 days);
        fundMe.donateToCampaign{value: 0.5 ether}(id);
        (, , , , , uint256 amountCollected) = fundMe.getCampaign(id);
        assertEq(amountCollected, 0.5 ether);
    }

    function testGetDonators() public {
        uint256 id = fundMe.createCampaign("Test", "Desc", 1 ether, block.timestamp + 1 days);
        address donor1 = address(0x1);
        address donor2 = address(0x2);
        vm.deal(donor1, 1 ether);
        vm.deal(donor2, 1 ether);
        vm.prank(donor1);
        fundMe.donateToCampaign{value: 0.1 ether}(id);
        vm.prank(donor2);
        fundMe.donateToCampaign{value: 0.2 ether}(id);
        (address[] memory donators, uint256[] memory donations) = fundMe.getDonators(id);
        assertEq(donators.length, 2);
        assertEq(donators[0], donor1);
        assertEq(donators[1], donor2);
        assertEq(donations[0], 0.1 ether);
        assertEq(donations[1], 0.2 ether);
    }

    function testWithdraw() public {
        address payable owner = payable(address(0xBEEF));
        address donor = address(0x1);
        vm.deal(donor, 2 ether);
        vm.startPrank(owner);
        uint256 future = block.timestamp + 1 days;
        uint256 id = fundMe.createCampaign("Test", "Desc", 1 ether, future);
        vm.stopPrank();
        vm.prank(donor);
        fundMe.donateToCampaign{value: 1 ether}(id);
        // Fast forward time past deadline
        vm.warp(future + 1);
        vm.prank(owner);
        fundMe.withdraw(id);
        (, , , , , uint256 amountCollected) = fundMe.getCampaign(id);
        assertEq(amountCollected, 0);
    }
}
