import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { fetchCoins } from "../api";
import { isDarkAtom } from '../atom';

const Container = styled.div`
    max-width: 480px;
    margin: 0 auto;s
    padding: 0 20px;
`;
const Header = styled.header`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 10vh;
`;
const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
`;
const CoinsList = styled.ul`
`;
const Coin = styled.li`
    background-color: ${(props) => props.theme.itemBgColor};
    color: ${(props) => props.theme.textColor};
    border-radius: 15px;
    margin-bottom: 10px;
    a {
        display: flex;
        align-items: center;
        padding: 20px;
        transition: color 0.2s ease;
        color: ${(props) => props.theme.textColor};
    }
    &:hover {
        a {
            color: ${(props) => props.theme.accentColor};
        }
    }
`;
const Img = styled.img`
    width: 25px;
    height: 25px;
    margin-right: 10px;
`;

const ToggleButton = styled.button`
    position: absolute;
    top: 50%;
    right: 0px;
    height: 20px;
    border-radius: 10px;
    border: 0;
    cursor: pointer;
    transform: translate(0, -50%);
    background-color: ${(props) => props.theme.itemBgColor};
    color: ${(props) => props.theme.textColor};
`
interface CoinInterface {
    "id": string,
    "name": string,
    "symbol": string,
    "rank": number,
    "is_new": boolean,
    "is_active": boolean,
    "type": string
}

interface CoinsProps { }

function Coins({ }: CoinsProps) {
    const themeProps = useRecoilValue(isDarkAtom);
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

    const { isLoading, data } = useQuery<CoinInterface[]>("allCoins", fetchCoins);
    /*const [coins, setCoins] = useState<CoinInterface[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const response = await fetch("https://api.coinpaprika.com/v1/coins");
            const json = await response.json();
            setCoins(json.slice(0, 100));
            setLoading(false);
        })();
    }, []);*/

    return (
        <Container>
            <Helmet>
                <title>Coins</title>
            </Helmet>
            <Header>
                <Title>
                    Coins
                </Title>
                <ToggleButton onClick={toggleDarkAtom}>{themeProps ? "light theme" : "dark theme"}</ToggleButton>
            </Header>

            {isLoading ? ("Loading...") :
                (<CoinsList>
                    {data?.slice(0, 100).map((coin) =>
                        <Coin key={coin.id}>
                            <Link to={{
                                pathname: `/${coin.id}`,
                                state: {
                                    name: coin.name
                                }
                            }}>
                                <Img src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} />
                                {coin.name} &rarr;
                            </Link>
                        </Coin>
                    )}
                </CoinsList>)
            }
        </Container>
    );
}

export default Coins;