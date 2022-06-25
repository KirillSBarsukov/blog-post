import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { marked } from "marked";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import type { Post } from "~/models/post.server";

type LoaderData = { post: Post; html: string };
const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);
  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  const html = marked(post.markdown);
  console.log("pos", post);
  return json<LoaderData>({ post, html });
};
export default function PostSlug() {
  const { post, html } = useLoaderData() as LoaderData;
  const errors = useActionData();
  const transition = useTransition();
  const isCreating = Boolean(transition.submission);
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </label>

        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          disabled={isCreating}
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          {isCreating ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
