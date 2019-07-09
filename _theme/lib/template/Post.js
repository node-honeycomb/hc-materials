import React from 'react';
import { Link } from 'bisheng/router';
import collect from 'bisheng/collect';
import DocumentTitle from 'react-document-title';
import Layout from './Layout';
import {Menu} from 'antd';

const SubMenu = Menu.SubMenu;
const Post = (props) => {
  const { pageData, utils } = props;
  const { meta, description, content } = pageData;
  
  let route = {};
  props.picked.posts.forEach(item => {
    const data = item.meta.filename.split('/');
    const type = data[3];
    const title = data[4];
    if (title) {
      if (route[type]) {
        route[type].push(title);
      } else {
        route[type] = [title];
      }
    }
  });
  debugger;
  return (
    <DocumentTitle title={`${meta.title} | hc-materials`}>
      <Layout {...props}>
      <Menu
        defaultOpenKeys={Object.keys(route)}
        onClick={(e) => {
          console.log(e)
          if (e.key) {
            props.router.push(e.key + '/demo/README');
          }
          // const data = props.picked.posts.find(item => item.meta.title === e.key)
        }}
        style={{ width: 256,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          paddingLeft: 0,
          marginLeft: 0,
          overflow: 'auto'
         }}
        mode="inline"
      >
      {
        Object.keys(route).map(key => {
          return <SubMenu key={key} title={key}>
            {
              route[key].map(item => 
                <Menu.Item key={`/${key}/${item}`}>{item}</Menu.Item>
              )
            }
          </SubMenu>
        })
      }
      {/* {
        props.picked.posts.map(item => 
          <Menu.Item key={item.meta.title}>{item.meta.title}</Menu.Item>
        )
      } */}
      </Menu>
        <div className="hentry">
          <h1 className="entry-title">{meta.title}</h1>
          {
            !description ? null :
              <div className="entry-description">{utils.toReactComponent(description)}</div>
          }
          <div className="entry-content">{utils.toReactComponent(content)}</div>

          <div className="entry-meta">
            <time className="updated">
              {`${meta.publishDate.slice(0, 10)} `}
            </time>
            {
              !meta.tags ? null :
                <span>
                  in <span className="entry-tags">
                  {
                    meta.tags.map((tag, index) =>
                      <Link to={`/tags#${tag}`} key={index}>{tag}</Link>
                    )
                  }
                  </span>
                </span>
            }
            {
              !meta.source ? null :
                <a className="source sep" href={meta.source}>
                  {meta.source}
                </a>
            }
          </div>
        </div>
      </Layout>
    </DocumentTitle>
  );
}

export default collect(async (nextProps) => {
  if (!nextProps.pageData) {
    throw 404;
  }
  const pageData = await nextProps.pageData();
  return { pageData };
})(Post);
