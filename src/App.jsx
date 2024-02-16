import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import axios from "axios";

import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

const URL = "http://localhost:8019/api/users";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Address",
    dataIndex: ["address", "address"],
    key: "address",
  },
  {
    title: "City",
    dataIndex: ["address", "city"],
    key: "city",
  },
];

function App() {
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [filters, setFilters] = useState({ perPage: 10, page: 1, search: "" });

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setFilters({ ...filters, search, page: 1 });
  };

  const getUsers = async () => {
    try {
      setIsLoading(true);

      const resp = await axios
        .get(URL, {
          params: filters,
        })
        .then((resp) => resp.data);

      setUsers(resp.data);
      setTotal(resp.total);
    } catch (error) {
      console.log("users error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDownload = async (documentType) => {
    try {
      setIsDownloading(true);

      const file = await axios
        .get(URL, {
          params: {
            ...filters,
            documentType,
          },
          responseType: 'blob'
        })
        .then((resp) => resp.data);

        const fileExtension = documentType === 'pdf' ? 'pdf' : 'xlsx'

        const url = window.URL.createObjectURL(file)

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `users-report.${fileExtension}`)

        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)


        console.log({file})
    } catch (error) {
      console.log("users error", error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [filters]);

  const items = [
    {
      key: "1",
      label: (
        <Button
          onClick={() => onDownload("excel")}
          icon={<FileExcelOutlined />}
          type="link"
        >
          Excel
        </Button>
      ),
    },
    {
      key: "3",
      label: (
        <Button
          onClick={() => onDownload("pdf")}
          icon={<FilePdfOutlined />}
          type="link"
        >
          PDF
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Users report"
      extra={
        <Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {isDownloading ? <Spin size="small" /> : null}
              Download
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      }
    >
      <Row gutter={[16, 24]}>
        <Col className="gutter-row" span={24}>
          <form onSubmit={onSubmit}>
            <Space>
              <Input
                value={search}
                onChange={onChangeSearch}
                placeholder="Basic usage"
                style={{ maxWidth: "200px" }}
              />
              <Button htmlType="submit" type="primary">
                Search
              </Button>
            </Space>
          </form>
        </Col>
        <Col className="gutter-row" span={24}>
          <Table
            rowKey="id"
            dataSource={users}
            columns={columns}
            loading={isLoading}
            pagination={{
              defaultPageSize: filters.perPage,
              total,
              onChange: (page, perPage) => {
                setFilters({ ...filters, page, perPage });
              },
              showSizeChanger: true,
              pageSizeOptions: [10, 25, 30],
            }}
          />
        </Col>
      </Row>
    </Card>
  );
}

export default App;
