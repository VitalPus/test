import { useEffect, useState, useRef, useCallback } from "react";
import { List, Card, Tag, Spin } from "antd";
import { useGetPostsQuery } from "./postApi";

const LIMIT = 10;

const PostList = () => {
  const [skip, setSkip] = useState(0);
  const [allPosts, setAllPosts] = useState([]);
  const { data, isFetching } = useGetPostsQuery({
    limit: LIMIT,
    skip,
  });
  const loader = useRef(null);

  useEffect(() => {
    if (data?.posts) {
      setAllPosts((prev) => [...prev, ...data.posts]);
    }
  }, [data]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching) {
        setSkip((prev) => prev + LIMIT);
      }
    },
    [isFetching]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "auto" }}>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={allPosts}
        renderItem={(post) => (
          <List.Item key={post.id}>
            <Card title={post.title}>
              <p
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {post.body}
              </p>
              <div style={{ marginTop: 10 }}>
                {post.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                👍 {post.reactions.likes} | 👎 {post.reactions.dislikes}
              </div>
            </Card>
          </List.Item>
        )}
      />
      {isFetching && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      )}
      <div ref={loader} />
    </div>
  );
};
export default PostList;
