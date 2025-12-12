const { BrowserRouter, Switch, Route, Link } = ReactRouterDOM;
const { QueryClient, QueryClientProvider, useQuery } = ReactQuery;
const { createContext, useContext, useState, useMemo } = React;

const queryClient = new QueryClient();

type Pokemon = {
  name: string;
  id: number;
  image: string;
};

type PokemonContextValue = {
  data?: Pokemon[];
  isLoading: boolean;
  error: unknown;
};

const PokemonContext = createContext<PokemonContextValue>({
  data: undefined,
  isLoading: true,
  error: null,
});

const PokemonProvider = ({ children }) => {
  const query = useQuery<Pokemon[]>({
    queryKey: ["logfetch", 100],
    queryFn: async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
      if (!res.ok) throw new Error("failed to fetch");
      const json = await res.json();
      return json.results.map((p: { name: string; url: string }) => {
        const id = parseInt(p.url.split("/").filter(Boolean).pop()!, 10);
        return {
          name: p.name,
          id,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });
    },
  });

  return (
    <PokemonContext.Provider
      value={{
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

const Layout = ({ children }: React.ReactNode) => (
  <div
    style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      color: "#0f172a",
    }}
  >
    <aside
      style={{
        width: "220px",
        borderRight: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "12px", fontWeight: 700, fontSize: "16px" }}>
        ログ取得ツール
      </div>
      <nav style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
        <Link
          to="/"
          style={{
            padding: "8px",
            borderRadius: "6px",
            textDecoration: "none",
            color: "#0f172a",
            background: "#f1f5f9",
          }}
        >
          Home
        </Link>
        <Link
          to="/logfilter"
          style={{
            padding: "8px",
            borderRadius: "6px",
            textDecoration: "none",
            color: "#0f172a",
            background: "#f1f5f9",
          }}
        >
          LogFilter
        </Link>
      </nav>
    </aside>
    <main style={{ flex: 1, padding: "20px" }}>{children}</main>
  </div>
);

const Home = () => {
  const { data, isLoading, error } = useContext(PokemonContext);
  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error</div>;
  return <div>Home: {data?.length ?? 0} 件</div>;
};

type FormProps = {
  value: string;
  onChange: (v: string) => void;
};
const FilterForm = ({ value, onChange }: FormProps) => (
  <div style={{ marginBottom: "12px" }}>
    <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
      名前でフィルター
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="pikachu など"
      style={{
        width: "100%",
        padding: "8px 10px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        fontSize: "14px",
        boxSizing: "border-box",
      }}
    />
  </div>
);

const PokemonItem = ({ pokemon }: Pokemon) => (
  <li
    key={pokemon.id}
    style={{
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "8px",
      textAlign: "center",
      backgroundColor: "#fff",
    }}
  >
    <img
      src={pokemon.image}
      alt={pokemon.name}
      width="72"
      height="72"
      style={{ display: "block", margin: "0 auto 6px" }}
    />
    <span style={{ textTransform: "capitalize", fontSize: "14px" }}>
      {pokemon.name}
    </span>
  </li>
);

const PokemonView = ({ list }: Pokemon[]) => {
  return (
    <div>
      {list.map((pokemon) => (
        <PokemonItem key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

const LogFilter = () => {
  const { data, isLoading, error } = useContext(PokemonContext);
  const [filter, setFilter] = useState<string>("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = filter.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => p.name.toLowerCase().includes(q));
  }, [data, filter]);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error</div>;

  return (
    <div>
      <FilterForm value={filter} onChange={setFilter} />
      <PokemonView list={filtered} />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PokemonProvider>
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/logfilter" component={LogFilter} />
            </Switch>
          </Layout>
        </PokemonProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
