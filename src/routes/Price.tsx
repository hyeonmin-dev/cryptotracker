import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Overview = styled.main`
  width: 100%;
  height: 50px;
  background-color: ${(props) => props.theme.itemBgColor};
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin: 10px 0;
  padding: 20px;
  transform: translateY(-5px);
`;

const Tag = styled.h3`
  width: 50%;
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
`;

const Value = styled.div`
  width: 50%;
`;

const Text = styled.h3<{ isPositive?: Boolean }>`
  font-size: 16px;
  color: ${(props) => (props.isPositive ? props.theme.accentColor : "tomato")};
`;

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
interface PriceProps {
    coinId: string;
    tickersData?: PriceData;
}
function checkValue(value: number | undefined) {
    if (value) {
        return value > 0;
    }
}
function Price({ coinId, tickersData }: PriceProps) {
    const [data, setData] = useState<PriceData>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setData(tickersData);
        setLoading(false);
    }, [coinId, tickersData]);
    console.log(data?.quotes);
    return (
        <Container>
            {loading ? (
                "Loading Price..."
            ) : (
                <>
                    <Overview>
                        <Tag>Price :</Tag>
                        <Value>
                            <Text isPositive={true}>
                                $ {data?.quotes.USD.price.toFixed(3)}
                            </Text>
                        </Value>
                    </Overview>

                    <Overview>
                        <Tag> Change rate (last 30 Minutes):</Tag>
                        <Value>
                            <Text
                                isPositive={
                                    checkValue(data?.quotes.USD.percent_change_30m) === true
                                }
                            >
                                {data?.quotes.USD.percent_change_30m} %
                            </Text>
                        </Value>
                    </Overview>

                    <Overview>
                        <Tag> Change rate (last 1 hours):</Tag>
                        <Value>
                            <Text
                                isPositive={
                                    checkValue(data?.quotes.USD.percent_change_1h) === true
                                }
                            >
                                {data?.quotes.USD.percent_change_1h} %
                            </Text>
                        </Value>
                    </Overview>

                    <Overview>
                        <Tag> Change rate (last 12 hours):</Tag>
                        <Value>
                            <Text
                                isPositive={
                                    checkValue(data?.quotes.USD.percent_change_12h) === true
                                }
                            >
                                {data?.quotes.USD.percent_change_12h} %
                            </Text>
                        </Value>
                    </Overview>

                    <Overview>
                        <Tag> Change rate (last 24 hours):</Tag>
                        <Value>
                            <Text
                                isPositive={
                                    checkValue(data?.quotes.USD.percent_change_24h) === true
                                }
                            >
                                {data?.quotes.USD.percent_change_24h} %
                            </Text>
                        </Value>
                    </Overview>
                </>
            )}
        </Container>
    );
}

export default Price;