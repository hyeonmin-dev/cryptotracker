import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { ExtractRouteParams, Switch, Route, useLocation, useRouteMatch, useHistory } from "react-router";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
    max-width: 480px;
    margin: 10px auto;
    padding: 0 20px;
`;
const Header = styled.header`    
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 10vh;

    a{
        display: inline-block;
        height: 50px;
        line-height: 60px;
        border: 0;
        color: ${(props) => props.theme.textColor};
        font-size: 14px;
        cursor: pointer;
        position: absolute;
        left:0;
    }
`;
const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
`;
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.itemBgColor};
  margin-top: 10px;
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.itemBgColor};
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
        props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouterInterface {
    coinId: string,
}

interface CoinInterface {
    name: string,
}

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        };
    };
}

interface CoinProps { }


function Coin({ }: CoinProps) {
    const { coinId } = useParams<RouterInterface>();
    const { state } = useLocation<CoinInterface>();
    const priceMatch = useRouteMatch("/:coinId/price");
    const chartMatch = useRouteMatch("/:coinId/chart");
    const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(["info", coinId], () => fetchCoinInfo(coinId));
    const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(["tickers", coinId], () => fetchCoinTickers(coinId), {
        refetchInterval: 5000,
    });
    const loading = infoLoading || tickersLoading;

    return (
        <Container>
            <Helmet>
                <title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title>
            </Helmet>
            <Header>
                <Link to="/">
                    ← back
                </Link>
                <Title>
                    {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
                </Title>
            </Header>

            {loading ? "Loading..." :
                (
                    <>
                        <Overview>
                            <OverviewItem>
                                <span>RANK:</span>
                                <span>{infoData?.rank}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>SYMBOL:</span>
                                <span>{infoData?.symbol}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>PRICE:</span>
                                <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
                            </OverviewItem>
                        </Overview>
                        <Description>
                            {infoData?.description}
                        </Description>
                        <Overview>
                            <OverviewItem>
                                <span>TOTAL SUPLY:</span>
                                <span>{tickersData?.total_supply}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>MAX SUPPLY:</span>
                                <span>{tickersData?.max_supply}</span>
                            </OverviewItem>
                        </Overview>

                        <Tabs>
                            <Tab isActive={chartMatch != null ? true : false}>
                                <Link to={`/${coinId}/chart`}>
                                    Chart
                                </Link>
                            </Tab>
                            <Tab isActive={priceMatch != null ? true : false}>
                                <Link to={`/${coinId}/price`}>
                                    Price
                                </Link>
                            </Tab>
                        </Tabs>
                        <Switch>
                            <Route path={`/:coinId/chart`}>
                                <Chart coinId={coinId} />
                            </Route>
                            <Route path={`/:coinId/price`}>
                                <Price coinId={coinId} tickersData={tickersData} />
                            </Route>
                        </Switch>
                    </>
                )
            }
        </Container>
    );
}

export default Coin;