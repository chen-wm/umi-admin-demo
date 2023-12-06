import { REQUEST_CODE } from '@/constants';
import services from '@/services/demo';
import { addUserList, deleteUserList, getUserList } from '@/services/user';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Divider, Drawer, Popconfirm, message } from 'antd';
// @ts-ignore
import qs from 'qs';
import React, { useMemo, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';

const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    const data = JSON.stringify({ ...fields });
    await addUserList(data);
    hide();
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const UserTableList: React.FC<unknown> = () => {
  const [tableData, setTableData] = useState([]);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const { runAsync: initUserList } = useRequest(
    (data) => getUserList({ ...data }),
    {
      manual: true,
      onSuccess: (res) => {
        setTableData(res.data);
      },
    },
  );
  useRequest((data) => addUserList(data), {
    manual: true,
    onSuccess: () => {
      message.success('添加成功');
      initUserList({});
    },
  });

  const deleteHandle = async ({ id }: { id: number }) => {
    const data = qs.stringify({ id });
    const res = await deleteUserList(data);
    if (res.code === REQUEST_CODE.SUCCESS) {
      message.success(res.message);
      initUserList({});
    }
  };
  // const listRequest = useMemo(() => function, []);
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '用户名称',
      dataIndex: 'username',
      tip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '邮箱为必填项',
          },
        ],
      },
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      valueType: 'text',
    },
    {
      title: '权限',
      dataIndex: 'role',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            配置
          </Button>
          <Divider type="vertical" />
          <Button type="link">订阅警报</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this item?"
            onConfirm={() => deleteHandle(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  const addColumns = useMemo(
    () => columns.filter((item) => item.dataIndex !== 'registerTime'),
    [columns],
  );
  return (
    <PageContainer
      header={{
        title: '用户管理',
      }}
    >
      <ProTable<API.UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        dataSource={tableData}
        columns={columns as any}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={addColumns as any}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<API.UserInfo>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserTableList;
