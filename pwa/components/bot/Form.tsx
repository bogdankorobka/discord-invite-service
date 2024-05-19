import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Bot } from "../../types/Bot";

interface Props {
  bot?: Bot;
}

interface SaveParams {
  values: Bot;
}

interface DeleteParams {
  id: string;
}

const saveBot = async ({ values }: SaveParams) =>
  await fetch<Bot>(!values["@id"] ? "/bots" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteBot = async (id: string) =>
  await fetch<Bot>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ bot }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Bot> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveBot(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Bot> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteBot(id), {
    onSuccess: () => {
      router.push("/bots");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!bot || !bot["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: bot["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/bots"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {bot ? `Edit Bot ${bot["@id"]}` : `Create Bot`}
      </h1>
      <Formik
        initialValues={
          bot
            ? {
                ...bot,
              }
            : new Bot()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/bots");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bot_merchant_guid"
              >
                merchant_guid
              </label>
              <input
                name="merchant_guid"
                id="bot_merchant_guid"
                value={values.merchant_guid ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.merchant_guid && touched.merchant_guid
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.merchant_guid && touched.merchant_guid
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="merchant_guid"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bot_token"
              >
                token
              </label>
              <input
                name="token"
                id="bot_token"
                value={values.token ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.token && touched.token ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.token && touched.token ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="token"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bot_id"
              >
                id
              </label>
              <input
                name="id"
                id="bot_id"
                value={values.id ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.id && touched.id ? "border-red-500" : ""
                }`}
                aria-invalid={errors.id && touched.id ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="id"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bot_created_at"
              >
                created_at
              </label>
              <input
                name="created_at"
                id="bot_created_at"
                value={values.created_at?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.created_at && touched.created_at
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.created_at && touched.created_at ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="created_at"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bot_updated_at"
              >
                updated_at
              </label>
              <input
                name="updated_at"
                id="bot_updated_at"
                value={values.updated_at?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.updated_at && touched.updated_at
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.updated_at && touched.updated_at ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="updated_at"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bot_createdAt"
              >
                createdAt
              </label>
              <input
                name="createdAt"
                id="bot_createdAt"
                value={values.createdAt?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.createdAt && touched.createdAt ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.createdAt && touched.createdAt ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="createdAt"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="bot_updatedAt"
              >
                updatedAt
              </label>
              <input
                name="updatedAt"
                id="bot_updatedAt"
                value={values.updatedAt?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.updatedAt && touched.updatedAt ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.updatedAt && touched.updatedAt ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="updatedAt"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {bot && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
