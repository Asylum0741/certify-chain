// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateNFT {
    struct Certificate {
        address issuer;
        string issuerName;
        string certificateId;
        string studentId;
        string studentName;
        uint256 timestamp;
    }

    mapping(bytes32 => Certificate) public certificates;

    // --- EVENTS ---
    event CertificateMinted(
        bytes32 indexed certificateHash,
        address indexed issuer,
        string issuerName,
        string certificateId,
        string studentId,
        string studentName,
        uint256 timestamp
    );

    event CertificateVerified(
        bytes32 indexed certificateHash,
        bool exists,
        address indexed issuer,
        string issuerName
    );

   // --- MINT FUNCTION ---
function mintCertificate(
    string memory issuerName,
    string memory certificateId,
    string memory studentId,
    string memory studentName
) public returns (bytes32 certificateHash) {
    // Generate a unique hash for the certificate
    certificateHash = keccak256(
        abi.encodePacked(
            issuerName,
            certificateId,
            studentId,
            studentName,
            block.timestamp
        )
    );

    // Ensure the certificate does not already exist
    require(certificates[certificateHash].timestamp == 0, "Certificate already exists");

    // Store certificate data
    certificates[certificateHash] = Certificate({
        issuer: msg.sender,
        issuerName: issuerName,
        certificateId: certificateId,
        studentId: studentId,
        studentName: studentName,
        timestamp: block.timestamp
    });

    // Emit event for off-chain verification
    emit CertificateMinted(
        certificateHash,
        msg.sender,
        issuerName,
        certificateId,
        studentId,
        studentName,
        block.timestamp
    );

    // Return the hash for frontend/backend confirmation
    return certificateHash;
}

    // --- VERIFY FUNCTION ---
    function verifyCertificate(bytes32 certHash) public view returns (
        address issuer,
        string memory issuerName,
        string memory certificateId,
        string memory studentId,
        string memory studentName,
        uint256 timestamp
    ) {
        Certificate memory cert = certificates[certHash];
        require(cert.timestamp != 0, "Certificate not found");

        return (
            cert.issuer,
            cert.issuerName,
            cert.certificateId,
            cert.studentId,
            cert.studentName,
            cert.timestamp
        );
    }
}
