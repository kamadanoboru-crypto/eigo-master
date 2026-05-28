type CoinCostLabelProps = {
  children: string;
  coins: number;
};

export function CoinCostLabel({ children, coins }: CoinCostLabelProps) {
  return (
    <>
      {children}（🪙{coins}コイン）
    </>
  );
}
