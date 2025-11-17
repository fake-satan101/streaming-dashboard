interface TestPageProps {
  params: {
    id: string;
  };
}

export default function TestPage({ params }: TestPageProps) {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Test Dynamic Route</h1>
        <div className="space-y-4">
          <p><strong>Movie ID from params:</strong> {params.id}</p>
          <p><strong>Type of ID:</strong> {typeof params.id}</p>
          <p><strong>Is valid number:</strong> {!isNaN(Number(params.id)) ? 'Yes' : 'No'}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Test Links:</h2>
          <div className="space-x-4">
            <a href="/test/movies/123" className="text-red-500 hover:underline">Test ID 123</a>
            <a href="/test/movies/456" className="text-red-500 hover:underline">Test ID 456</a>
            <a href="/test/movies/abc" className="text-red-500 hover:underline">Test invalid ID</a>
          </div>
        </div>
      </div>
    </div>
  );
}