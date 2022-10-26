import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import * as mk from "merkletreejs";
import * as kec from "keccak256";
import { ethers } from "ethers";
import { web3 } from "web3";
//import * as web3 from "web3";



const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;



function App() {  
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`You can only mint 1 NFT for PUBLIC MINT per address regardless your mint amount input!`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

// Group 0 : 71 addresses - 1 mint
  const addressGroup_0 = ['0xa44c743bf3105ae25c94d870b9913a346eabf10f','0xaee2b529d29aa9cd4a56d9778ce088837c4b2e0a','0xfb1175cfe5b6b39d30917cbdfd08fa82165aa7ae','0xd72c27bf47f7f71d58261507ae6a7f27c9ffae6c','0x13f86e265a2f66ad664bf5a3d1dccd115204b3bb','0xb82e8bce140e4c4ee0d3963484cb7648f1af0c46','0x7e742e90decd7bf280ee3d625d90e84b67b50505','0x5c5db6c52a70359f8266efad465f4d5da3cbbfde','0x27e12c5f1d315a75337190e23fc85d1590156d30','0x83d5ddbef2b448f09ee7d8293ba07aabeec37971','0x867cdaf0513c4b6b4a91ceee5c850c87093e172f','0xaeae109ab3945fc54465f24bc6eb37941c69aa58','0x31cb2f55a1e34d61c8558f5d8b7c600e62073b03','0xd5d4b515c65d1b2c6bad1ce2373a73254b6c0296','0xc445278e3db529824f570287294f20b76d8960a7','0x7a8398e9da53fc9184e03612aaceed08ce0e24af','0xdabc4b17eceeb4a11010f9c11a413a333ed7c25f','0x5831240fd3f7593f627da552fe7ddd60e9685723','0xc1c40ad78b96bea82fd4b491c005146e2a0dd325','0x85f15d0e945d96cf43a9156bc6ff63f8821b904a','0x5bae9c2161576a1ae2ae2d6ba95299a2d97dcfc3','0x01ea60f8f2500d80c2ba0476b8bf99f87d99f813','0x592cc2bc5c1330279beb8188a818f724339b3621','0xdbd500ac59a38f7fca3471f40473db9994229ba9','0x4770f67db9d09ca7347c1fccbf3795a464065ecb','0x5613773ce56140a62938a8d984463d81b57ec2d7','0xb1e2526b4a88f6bcf731fa6a288558c13af797f2','0x41b52cf255d0708b399ee6a48253e45aff929b60','0xf0c796a4c893064b0c11cc0baa05bfb11cbdc982','0xcba374265fa7b8902023933fc77aafa8d3237e56','0xccc67191e64ba5a46343be923c713c7bad1f7acf','0xd254013bd93fc56b74d0c16b1edaa3a032468226','0x91bd8ac4c61a9304f9af2d999e2a5f7a4cc77f52','0xd451efc3e2208cd15b3d95600e7123e524685dc5','0x29be2c9cca5e92882815181b210e783bc8fcb05e','0xbcd240a4843d813a51d9390c98c8c342d3de8594','0x40e4d9395824f75c8d1bd72a4372a1c10d4e19d3','0xbd0ebe8c9985a2f9f43177b5ec0d04cd0bb82676','0x256a87b0e1608d56df391f3e11c0e7e863033ddb','0x19583d656a13d099e4c5fb6f8c5879ae950b3e7d','0x7e742e90decd7bf280ee3d625d90e84b67b50505','0x5bae9c2161576a1ae2ae2d6ba95299a2d97dcfc3','0x31cb2f55a1e34d61c8558f5d8b7c600e62073b03','0x8b4595cb53eeda35e163c6a8f686f95e6747d8b9','0xb226f2d18b0354e1abd4b44eb8756eed892e4094','0x87299c7fe50b94f2d54eb3c48fb37d3dbc5ba1ae','0x592cc2bc5c1330279beb8188a818f724339b3621','0x5b8c1ee5f9f5457cb883e0dfe2b7cbc9266fc7f9','0x381e3def5dbaeb609d1415b30ec6e33ffcbb306a','0xb48496b478f36c0b35359662d51bf202f1df8e76','0x9688eff10bb5a589c289341cbf01d91b56fe3b98','0xd3bd262994ebbb36fc1ce8620ddcc5211dc1aa83','0xf7ab78cddebfd5f0815d196e8b44838c6376a049','0x9d81edf075a7fa717b4d1db7a40aeb56868269c1','0x5bae9c2161576a1ae2ae2d6ba95299a2d97dcfc3','0xbc201464494963c6504e98c8d30fadfed818ff94','0x36e67737cc481404efd0dc0015712167c222f73e','0xe2e2a15b5a2d0a6eb5ce5b82e5a4edc1e0ee1a15','0xcc70f59e944e3acec63268db4d01367e03d69e12','0xf8a448f0e4b9b3ddcecc695266d37dc4cf6e701c','0x9865ae47eaab343666d7e0aca36c2a4f0851afd8','0x9f9eff733b94f22bbf6d33d336f65e70c8946288','0xa2441174452ad49136d1a2405774c7f2de38de24','0x532e73655720e26ac59783b1d502ace236bd6ea1','0xd82160b8afe551f6ff088011c16b400a6056e4bc','0x4eec17f5adf58624946f4770b78d461122a8d139','0xa9848624c53f7eb4562628b4f6c4d42441b0073b','0x7a7aad920d827cbc325577af8a479f636ceca722','0x85be25d0ef53959db27d42df1f7da57549154d5f'];

  // Group 1 : 4 addresses - 2 mints
  const addressGroup_1 = ['0xe3b84986472f7fea21e7f7b447456160b304d2ed','0x723372cc9bb8dfa422ac0f80f8b18b4d617cd5d0','0xf6899b1b495fa263bb8d214f8aff56caf13ea358','0x022993d3edab7056b48e1417224d340e7a3eae6b'];

  // Group 2: 8 addresses - 3 mints
  const addressGroup_2 = ['0xf8ba38a1054b7f86f2aad2b810943b300a1de4ba','0x8a1a99a63c4f4fac2b48b1061d19275ddf86f3f8','0x8fbfd3fabd443334b6f413b5931477d4debeafa9','0xf46253da839974633078bbc2cd71744a5b6b8b63','0x3e5d93811684fb7d3d26a93bc36aad003b0de745','0xa6c6b7327b30dda256d3485f8e1610b63c7690bd','0x1bc6f80da87bdab3c94d7b1b7a513fe4fc2254f5','0x95ef28c0d1c01279affa193cd4670b621be06c75'];

  function generateProof() {
    let walletAddress = ethers.utils.getAddress(blockchain.account).toLowerCase();
    console.log("Wallet Address: " + walletAddress);

    // Detect the address group and assign
    let addressGroup;
    if(addressGroup_0.includes(walletAddress)){
      addressGroup = addressGroup_0;
      console.log("Group 0 detected!");
    }
    else if (addressGroup_1.includes(walletAddress)){
      addressGroup = addressGroup_1;
      console.log("Group 1 detected!");
    }
    else if (addressGroup_2.includes(walletAddress)){
      addressGroup = addressGroup_2;
      console.log("Group 2 detected!");
    }

    console.log("Address group: " + addressGroup);

    if (addressGroup == undefined){
      console.log("The wallet you have connected is not on the whitelist!")
      setFeedback("Sorry, it seems you are not in the whitelist. Please wait for public mint!");
      setClaimingNft(false);
      return false;
    }

    let leaves = addressGroup.map(x => keccak256(x));
    let tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    console.log("Root: " + buf2hex(tree.getRoot()))

    let walletLeaf = buf2hex(keccak256(blockchain.account));
    console.log("Wallet Leaf: " + walletLeaf);

    let walletProof = tree.getProof(walletLeaf).map(x => buf2hex(x.data));
    console.log("Proof: " + walletProof);

    return walletProof;
  }

  const claimWL = () => {
    let cost = 0;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(250000);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);

    // Generate proof
    let proof = generateProof();
    if (proof == false) { return; }

    blockchain.smartContract.methods
      .whitelistMint(mintAmount, proof)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const publicMint = () => {
    let cost;
    if (data.totalSupply >= 200){
      cost = CONFIG.WEI_COST;
    }
    else{
      cost = 0;
    }
    
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(150000);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);

    blockchain.smartContract.methods
      .publicMint(1)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 3) {
      newMintAmount = 3;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const buf2hex = x => '0x' + x.toString('hex');

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <a href={CONFIG.MARKETPLACE_LINK}>
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        </a>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >
              <StyledButton
                style={{
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                {CONFIG.MARKETPLACE}
              </StyledButton>
            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {(data.totalSupply >= 200) ? CONFIG.DISPLAY_COST : 0}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimWL();
                          getData();
                        }}
                      >
                        {claimingNft ? "Busy" : "WL Mint"}
                      </StyledButton>
                    </s.Container>
                    <s.Container style={{ marginTop: "2vh" }} ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          publicMint();
                          getData();
                        }}
                      >
                        {claimingNft ? "Busy" : "Public Mint"}
                      </StyledButton>
                    </s.Container>
                    <s.Container style={{ marginTop: "2vh" }} ai={"center"} jc={"center"} fd={"row"}>
                      <a class="twitter-share-button"
                        href= "https://twitter.com/intent/tweet?text=This%20collection%20is%20fucking%20awesome!!%20@cc0py_eth%20🔥🔥🚀🚀%20%23CC0PY%20%23FUKC">
                      </a>
                      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
