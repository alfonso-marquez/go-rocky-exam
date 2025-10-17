import { Button } from "../ui/button";

export default function HeroPhoto() {
  return (
    <section className="py-32">
      <div className="container text-center">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <h1 className="text-3xl font-semibold lg:text-6xl">Photos Library</h1>
          <p className="text-muted-foreground text-balance lg:text-lg">
            Check out all the photos uploaded by our users!
          </p>
        </div>
        <Button asChild size="lg" className="mt-10">
          <a href="/albums">Uplod your photo</a>
        </Button>
      </div>
    </section>
  );
}
