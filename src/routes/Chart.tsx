import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atom";

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}
interface ChartProps {
    coinId: string;
}
function Chart({ coinId }: ChartProps) {
    const isDark = useRecoilValue(isDarkAtom);
    const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
        fetchCoinHistory(coinId),
        {
            refetchInterval: 10000,
        }
    );

    console.log(data);
    return (
        <div>
            {isLoading ? "Loading Chart..." :
                <ApexChart
                    type="candlestick"
                    series={[
                        {
                            name: "Price",
                            data: data?.map((price) => ({
                                x: price.time_close.substring(0, 10),
                                y: [price.close, price.high, price.low, price.open],
                            })),
                        },
                    ]}
                    options={{
                        theme: {
                            mode: isDark ? "dark" : "light",
                        },
                        yaxis: {
                            labels: {
                                formatter: (value) => { return value.toFixed(2) },
                            },

                        },
                    }}
                />
            }
        </div>
    );
}

export default Chart;


/*
<ApexChart
    type="line"
    series={[
        {
            name: "Price",
            data: data?.map((price) => price.close),
        },
    ]}
    options={{
        theme: {
            mode: isDark ? "dark" : "light",
        },
        chart: {
            height: 300,
            width: 500,
            toolbar: {
                show: false,
            },
            background: "transparent",
        },
        grid: { show: false },
        stroke: {
            curve: "smooth",
            width: 4,
        },
        yaxis: {
            show: false,
        },
        xaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false },
            categories: data?.map((price) => price.time_close.substring(0, 10)),
        },
        fill: {
            type: "gradient",
            gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
        },
        colors: ["#0fbcf9"],
        tooltip: {
            theme: isDark ? "dark" : "light",
            y: {
                formatter: (value) => `$${value.toFixed(2)}`,
            },
        },
    } }
/>*/