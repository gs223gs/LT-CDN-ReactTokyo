const { HashRouter, Switch, Route, Link } = ReactRouterDOM;
const { QueryClient, QueryClientProvider, useQuery } = ReactQuery;

const queryClient = new QueryClient();

type Pokemon = {
  name: string;
  id: number;
  image: string;
};

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
    <aside
      style={{
        width: '220px',
        borderRight: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '12px', fontWeight: 700, fontSize: '16px' }}>ログ取得ツール</div>
      <nav style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
        <Link to="/" style={{ padding: '8px', borderRadius: '6px', textDecoration: 'none', color: '#0f172a', background: '#f1f5f9' }}>
          Home
        </Link>
        <Link to="/logfetch" style={{ padding: '8px', borderRadius: '6px', textDecoration: 'none', color: '#0f172a', background: '#f1f5f9' }}>
          LogFetch
        </Link>
      </nav>
    </aside>
    <main style={{ flex: 1, padding: '20px' }}>{children}</main>
  </div>
);

const Home: React.FC = () => <div>Home</div>;

const LogFetch: React.FC = () => {
  const { data, isLoading, error } = useQuery<Pokemon[]>({
    queryKey: ['logfetch', 100],
    queryFn: async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
      if (!res.ok) throw new Error('failed to fetch');
      const json = await res.json();
      return json.results.map((p: { name: string; url: string }) => {
        const id = parseInt(p.url.split('/').filter(Boolean).pop()!, 10);
        return {
          name: p.name,
          id,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });
    },
  });

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error</div>;

  return (
    <div>
      <p>全 {data?.length ?? 0} 件</p>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '12px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {data?.map((pokemon) => (
          <li
            key={pokemon.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px',
              textAlign: 'center',
              backgroundColor: '#fff',
            }}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              width="72"
              height="72"
              style={{ display: 'block', margin: '0 auto 6px' }}
            />
            <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{pokemon.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/logfetch" component={LogFetch} />
        </Switch>
      </Layout>
    </HashRouter>
  </QueryClientProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
