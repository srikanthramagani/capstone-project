// SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <=0.8.11;
pragma experimental ABIEncoderV2;

// Federated Learning Solidity Smart Contract
contract MLContract {

    uint public modelCount = 0;

    struct model {
        string model_name;
        string model_weight;
        string model_intercept;
        string model_classes;
    }

    mapping(uint => model) public modelList;

    event registerModel(uint indexed _modelId);

    // Submit a new model
    function saveBestModel(string memory mname, string memory mweight, string memory mi, string memory mc) public {
        modelList[modelCount] = model(mname, mweight, mi, mc);
        emit registerModel(modelCount);
        modelCount++;
    }

    // Update model properties
    function updateWeight(uint i, string memory weight) public {
        require(i < modelCount, "Invalid model index");
        modelList[i].model_weight = weight;
    }

    function updateHashcode(uint i, string memory mi) public {
        require(i < modelCount, "Invalid model index");
        modelList[i].model_intercept = mi;
    }

    function updateDate(uint i, string memory mc) public {
        require(i < modelCount, "Invalid model index");
        modelList[i].model_classes = mc;
    }

    // Get model count
    function getModelCount() public view returns (uint) {
        return modelCount;
    }

    // Get model details
    function getModelName(uint i) public view returns (string memory) {
        require(i < modelCount, "Invalid model index");
        return modelList[i].model_name;
    }

    function getWeight(uint i) public view returns (string memory) {
        require(i < modelCount, "Invalid model index");
        return modelList[i].model_weight;
    }

    function getIntercept(uint i) public view returns (string memory) {
        require(i < modelCount, "Invalid model index");
        return modelList[i].model_intercept;
    }

    function getClasses(uint i) public view returns (string memory) {
        require(i < modelCount, "Invalid model index");
        return modelList[i].model_classes;
    }
}
