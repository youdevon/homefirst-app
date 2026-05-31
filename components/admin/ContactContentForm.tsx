import AdminFormSection from "@/components/admin/AdminFormSection";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableContactContent } from "@/lib/contact-content-data";
import { getContactCardSlots } from "@/lib/contact-content-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type ContactContentFormProps = {
  content: EditableContactContent;
  imageFiles: MediaSelectorOption[];
};

export default function ContactContentForm({
  content,
  imageFiles,
}: ContactContentFormProps) {
  const cardSlots = getContactCardSlots(content.cards);

  return (
    <form
      method="post"
      action="/api/admin/contact"
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection
        title="Contact Hero"
        defaultOpen
        visibilityName="visibility_hero"
        visibilityEnabled={content.visibility.hero}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input
              type="text"
              name="hero_eyebrow"
              defaultValue={content.hero.eyebrow}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Background image URL</span>
            <AdminMediaUrlField
              name="hero_backgroundImageUrl"
              defaultValue={content.hero.backgroundImageUrl}
              options={imageFiles}
              required
              placeholder="/uploads/images/contact.jpg"
            />
          </label>

          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="hero_title"
              defaultValue={content.hero.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlighted title</span>
            <input
              type="text"
              name="hero_highlightedTitle"
              defaultValue={content.hero.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea
              name="hero_description"
              defaultValue={content.hero.description}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Contact Details"
        defaultOpen={false}
        visibilityName="visibility_contactDetails"
        visibilityEnabled={content.visibility.contactDetails}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Office name</span>
            <input
              type="text"
              name="details_officeName"
              defaultValue={content.details.officeName}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Address</span>
            <textarea
              name="details_address"
              defaultValue={content.details.address}
              required
            />
          </label>

          <label className="admin-field">
            <span>Phone</span>
            <input
              type="text"
              name="details_phone"
              defaultValue={content.details.phone}
              required
            />
          </label>

          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              name="details_email"
              defaultValue={content.details.email}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Office hours</span>
            <input
              type="text"
              name="details_officeHours"
              defaultValue={content.details.officeHours}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Map embed URL</span>
            <input
              type="text"
              name="details_mapEmbedUrl"
              defaultValue={content.details.mapEmbedUrl}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Map link URL</span>
            <input
              type="text"
              name="details_mapUrl"
              defaultValue={content.details.mapUrl}
              placeholder="https://maps.google.com"
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Instructions" defaultOpen={false}>
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="instructions_title"
              defaultValue={content.instructions.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlighted title</span>
            <input
              type="text"
              name="instructions_highlightedTitle"
              defaultValue={content.instructions.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea
              name="instructions_description"
              defaultValue={content.instructions.description}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Instruction items</span>
            <textarea
              name="instructions_items"
              defaultValue={content.instructions.items.join("\n")}
              required
              placeholder="One instruction per line"
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Contact form text"
        defaultOpen={false}
        visibilityName="visibility_enquiryForm"
        visibilityEnabled={content.visibility.enquiryForm}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Details eyebrow</span>
            <input
              type="text"
              name="form_detailsEyebrow"
              defaultValue={content.formCopy.detailsEyebrow}
              required
            />
          </label>

          <label className="admin-field">
            <span>Form title</span>
            <input
              type="text"
              name="form_title"
              defaultValue={content.formCopy.title}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Form description</span>
            <textarea
              name="form_description"
              defaultValue={content.formCopy.description}
              required
            />
          </label>

          <label className="admin-field">
            <span>Name label</span>
            <input
              type="text"
              name="form_nameLabel"
              defaultValue={content.formCopy.nameLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Email label</span>
            <input
              type="text"
              name="form_emailLabel"
              defaultValue={content.formCopy.emailLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Phone label</span>
            <input
              type="text"
              name="form_phoneLabel"
              defaultValue={content.formCopy.phoneLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Message label</span>
            <input
              type="text"
              name="form_messageLabel"
              defaultValue={content.formCopy.messageLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Submit label</span>
            <input
              type="text"
              name="form_submitLabel"
              defaultValue={content.formCopy.submitLabel}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Map / location"
        defaultOpen={false}
        visibilityName="visibility_map"
        visibilityEnabled={content.visibility.map}
      >
        {null}
      </AdminFormSection>

      <AdminFormSection
        title="Contact Cards"
        defaultOpen={false}
        lead="Manage quick-action cards shown on the contact page. Leave a card title empty to omit it."
        visibilityName="visibility_contactCards"
        visibilityEnabled={content.visibility.contactCards}
      >
        {cardSlots.map((card, index) => (
          <div className="admin-card-slot" key={`contact-card-${index}`}>
            <h3 className="admin-card-slot-title">Card {index + 1}</h3>
            <div className="admin-form-grid-2">
              <label className="admin-field">
                <span>Title</span>
                <input
                  type="text"
                  name={`card_${index}_title`}
                  defaultValue={card.title}
                />
              </label>

              <label className="admin-field">
                <span>Icon</span>
                <input
                  type="text"
                  name={`card_${index}_icon`}
                  defaultValue={card.icon}
                  placeholder="🏢"
                />
              </label>

              <label className="admin-field">
                <span>Display order</span>
                <input
                  type="number"
                  name={`card_${index}_displayOrder`}
                  min={0}
                  defaultValue={card.displayOrder}
                />
              </label>

              <label className="admin-field">
                <span>Status</span>
                <select
                  name={`card_${index}_active`}
                  defaultValue={card.active ? "true" : "false"}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>

              <label className="admin-field admin-field-full">
                <span>Description</span>
                <textarea
                  name={`card_${index}_description`}
                  defaultValue={card.description}
                />
              </label>

              <label className="admin-field">
                <span>Link label</span>
                <input
                  type="text"
                  name={`card_${index}_linkLabel`}
                  defaultValue={card.linkLabel}
                />
              </label>

              <label className="admin-field">
                <span>Link URL</span>
                <input
                  type="text"
                  name={`card_${index}_linkHref`}
                  defaultValue={card.linkHref}
                  placeholder="/contact or tel:+18686123456"
                />
              </label>
            </div>
          </div>
        ))}
      </AdminFormSection>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Contact Page
        </button>
      </div>
    </form>
  );
}
